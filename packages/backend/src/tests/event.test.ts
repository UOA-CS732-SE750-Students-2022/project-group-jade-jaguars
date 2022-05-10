import server from '../app';
import request from 'supertest';
import {
  AvailabilityStatus,
  EventModel,
  EventStatus,
} from '../schemas/event.schema';
import { StatusCodes } from 'http-status-codes';
import { UserModel } from '../schemas/user.schema';
import { Colour, TeamModel } from '../schemas/team.schema';
import { EventResponseDTO } from '../controllers/event.controller';
import { createServer, Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import Client from 'socket.io-client';
import { AddressInfo } from 'net';
import { splitDays } from '../service/event.service';

describe('Events', () => {
  describe('CRUD', () => {
    let userId;
    beforeEach(async () => {
      const userDoc = await UserModel.create({
        _id: 'x'.repeat(25),
        firstName: 'firstName',
        lastName: 'lastName',
      });
      userId = userDoc._id;
    });

    it('Get', async () => {
      const eventDoc = await EventModel.create({
        admin: userId,
        title: 'title',
        startDate: new Date('1900'),
        endDate: new Date('2000'),
      });

      const eventId = eventDoc._id.toString();
      const eventGetResponse = await request(server)
        .get(`/api/v1/event/${eventId}`)
        .expect(StatusCodes.OK);

      expect(eventGetResponse.body.id).toEqual(eventId);
    });

    it('Create without team (just admin)', async () => {
      const createResponse = await request(server)
        .post('/api/v1/event')
        .send({
          admin: userId,
          title: 'title',
          startDate: new Date('1900'),
          endDate: new Date('2000'),
        })
        .expect(StatusCodes.CREATED);

      expect(
        await EventModel.exists({ _id: createResponse.body.id }),
      ).toBeTruthy();

      const userDoc = await UserModel.findById(userId);
      expect(userDoc.events).toHaveLength(1);
      expect(userDoc.events[0]).toBe(createResponse.body.id);
    });

    it('Create event with team', async () => {
      // Create a second user to be a team member
      let memberDoc = await UserModel.create({
        _id: 'y'.repeat(25),
        firstName: 'firstName',
        lastName: 'lastName',
      });

      let teamDoc = await TeamModel.create({
        admin: userId,
        members: [memberDoc._id],
        title: 'title',
        color: Colour.BLUE,
      });

      const createResponse = await request(server)
        .post('/api/v1/event')
        .send({
          admin: userId,
          title: 'title',
          startDate: new Date('1900'),
          endDate: new Date('2000'),
          team: teamDoc._id,
        })
        .expect(StatusCodes.CREATED);

      expect(
        await EventModel.exists({ _id: createResponse.body.id }),
      ).toBeTruthy();

      const userDoc = await UserModel.findById(userId);
      expect(userDoc.events).toHaveLength(1);
      expect(userDoc.events[0]).toBe(createResponse.body.id);

      memberDoc = await UserModel.findById(memberDoc._id);
      expect(userDoc.events).toHaveLength(1);
      expect(userDoc.events[0]).toBe(createResponse.body.id);

      // check team has new event reference
      teamDoc = await TeamModel.findById(teamDoc._id);
      expect(teamDoc.events).toHaveLength(1);
      expect(teamDoc.events[0]).toBe(createResponse.body.id);
    });

    it('Patch', async () => {
      const spy = jest.spyOn(server.webSocket, 'send');

      const eventDoc = await EventModel.create({
        admin: userId,
        title: 'title',
        startDate: new Date('1900'),
        endDate: new Date('2000'),
      });

      const eventId = eventDoc._id.toString();
      const eventUpdateResponse = await request(server)
        .patch(`/api/v1/event/${eventId}`)
        .send({
          title: 'changed',
        })
        .expect(StatusCodes.OK);

      expect(eventUpdateResponse.body.title).toEqual('changed');
      expect(spy).toHaveBeenCalled();
    });

    it('Delete', async () => {
      const eventDoc = await EventModel.create({
        title: 'title',
        startDate: new Date('1900'),
        endDate: new Date('2000'),
        admin: userId,
      });
      const eventId = eventDoc._id.toString();

      await request(server)
        .delete(`/api/v1/event/${eventId}`)
        .expect(StatusCodes.NO_CONTENT);

      expect(await EventModel.exists({ _id: eventId })).toBe(null);
    });

    it('Fetch event users', async () => {
      let memberDoc = await UserModel.create({
        _id: 'y'.repeat(25),
        firstName: 'firstName',
        lastName: 'lastName',
      });
      const memberId = memberDoc._id;

      let teamDoc = await TeamModel.create({
        title: 'title',
        admin: userId,
        members: [memberId],
      });

      const eventDoc = await EventModel.create({
        title: 'title',
        startDate: new Date('1900'),
        endDate: new Date('2000'),
        admin: userId,
        team: teamDoc._id,
      });
      const eventId = eventDoc._id;

      const response = (
        await request(server)
          .get(`/api/v1/event/${eventId}/users`)
          .expect(StatusCodes.OK)
      ).body;

      expect(response).toHaveLength(2);
      expect(response[0].id).toBe(userId);
      expect(response[1].id).toBe(memberId);
    });

    it('Finalize event time', async () => {
      const startDate = new Date('1900');
      const endDate = new Date('2000');
      let eventDoc = await EventModel.create({
        title: 'title',
        startDate,
        endDate,
        admin: userId,
      });
      const eventId = eventDoc._id;

      await request(server)
        .post(`/api/v1/event/${eventId}/finalize`)
        .send({ startDate, endDate })
        .expect(StatusCodes.OK);

      eventDoc = await EventModel.findById(eventId);
      expect(eventDoc.availability.finalisedTime).toBeDefined();
      expect(eventDoc.availability.finalisedTime.startDate.toISOString()).toBe(
        startDate.toISOString(),
      );
      expect(eventDoc.availability.finalisedTime.endDate.toISOString()).toBe(
        endDate.toISOString(),
      );
      expect(eventDoc.status).toBe(EventStatus.Accepted);
    });
  });

  describe('Search', () => {
    let userId, userId2, teamId, eventId, eventId2;

    beforeEach(async () => {
      const startDate = new Date('1900');
      const endDate = new Date('2000');

      const userDoc = await UserModel.create({
        _id: 'x'.repeat(25),
        firstName: 'firstName',
        lastName: 'lastName',
      });
      userId = userDoc._id;

      const userDoc2 = await UserModel.create({
        _id: 'y'.repeat(25),
        firstName: 'firstName',
        lastName: 'lastName',
      });
      userId2 = userDoc2._id;

      const teamDoc = await TeamModel.create({
        title: 'title',
        description: 'description',
        admin: userId,
      });
      teamId = teamDoc._id;

      // Document with a team
      const eventDoc = await EventModel.create({
        title: 'title',
        description: 'description',
        startDate: new Date('1900'),
        endDate: new Date('2000'),
        team: teamId,
        admin: userId,
      });
      eventId = eventDoc._id;

      // Document without a team
      const eventDoc2 = await EventModel.create({
        title: 'title',
        description: 'description',
        startDate: new Date('1900'),
        endDate: new Date('2000'),
        admin: userId2,
        availability: {
          potentialTimes: [],
          finalisedTime: { startDate: startDate, endDate: endDate },
          attendeeAvailability: [
            {
              attendee: userId2,
              availability: [
                {
                  startDate,
                  endDate,
                  status: AvailabilityStatus.Available,
                },
              ],
            },
          ],
        },
      });

      eventId2 = eventDoc2._id;
    });

    it('By userId (event has team)', async () => {
      const searchResponse: EventResponseDTO[] = (
        await request(server)
          .post(`/api/v1/event/search`)
          .send({
            userId,
          })
          .expect(StatusCodes.OK)
      ).body;

      expect(searchResponse).toHaveLength(1);
      expect(searchResponse[0].id).toBe(eventId.toString());
    });

    it('By userId (event has no team, by availability)', async () => {
      const searchResponse: EventResponseDTO[] = (
        await request(server)
          .post(`/api/v1/event/search`)
          .send({
            userId: userId2,
          })
          .expect(StatusCodes.OK)
      ).body;

      expect(searchResponse).toHaveLength(1);
      expect(searchResponse[0].id).toBe(eventId2.toString());
    });

    it('By teamId', async () => {
      const searchResponse: EventResponseDTO[] = (
        await request(server)
          .post(`/api/v1/event/search`)
          .send({
            teamId,
          })
          .expect(StatusCodes.OK)
      ).body;

      expect(searchResponse).toHaveLength(1);
      expect(searchResponse[0].id).toBe(eventId.toString());
    });
    it('By title sub-string', async () => {
      const searchResponse: EventResponseDTO[] = (
        await request(server)
          .post(`/api/v1/event/search`)
          .send({
            titleSubStr: 'ti',
          })
          .expect(StatusCodes.OK)
      ).body;

      expect(searchResponse).toHaveLength(2);
      expect(searchResponse[0].id).toBe(eventId.toString());
      expect(searchResponse[1].id).toBe(eventId2.toString());
    });
    it('By description sub-string', async () => {
      const searchResponse: EventResponseDTO[] = (
        await request(server)
          .post(`/api/v1/event/search`)
          .send({
            descriptionSubStr: 'des',
          })
          .expect(StatusCodes.OK)
      ).body;

      expect(searchResponse).toHaveLength(2);
      expect(searchResponse[0].id).toBe(eventId.toString());
      expect(searchResponse[1].id).toBe(eventId2.toString());
    });
    it('By date range', async () => {
      const searchResponse: EventResponseDTO[] = (
        await request(server)
          .post(`/api/v1/event/search`)
          .send({
            startDate: new Date('1800'),
            endDate: new Date('2100'),
          })
          .expect(StatusCodes.OK)
      ).body;

      expect(searchResponse).toHaveLength(2);
      expect(searchResponse[0].id).toBe(eventId.toString());
      expect(searchResponse[1].id).toBe(eventId2.toString());
    });
    it('Create second event', async () => {
      // Create a second identical event
      await EventModel.create({
        title: 'title',
        startDate: new Date('1900'),
        endDate: new Date('2000'),
        team: teamId,
        admin: 'x'.repeat(25),
      });
    });
    it('Limit', async () => {
      // Create a second identical event
      await EventModel.create({
        title: 'title',
        startDate: new Date('1900'),
        endDate: new Date('2000'),
        team: teamId,
        admin: 'x'.repeat(25),
      });

      const searchResponse: EventResponseDTO[] = (
        await request(server)
          .post(`/api/v1/event/search`)
          .send({
            teamId,
            limit: 1,
          })
          .expect(StatusCodes.OK)
      ).body;

      expect(searchResponse).toHaveLength(1);
      expect(searchResponse[0].id).toBe(eventId.toString());
    });
    //TODO: This works as intended but the Jest doesn't seem to work here
    it.skip('Conflicting keys in payload', async () => {
      await expect(async () => {
        await request(server).get(`/api/v1/event/search`).send({
          teamId,
          eventId,
        });
      }).rejects.toThrow('I should fail');
    });
  });

  describe('User event availability', () => {
    let userId, teamId, eventId;

    const startDate = new Date('1900');
    const endDate = new Date('2000');
    beforeEach(async () => {
      const userDoc = await UserModel.create({
        _id: 'x'.repeat(25),
        firstName: 'firstName',
        lastName: 'lastName',
      });
      userId = userDoc._id;

      const teamDoc = await TeamModel.create({
        title: 'title',
        admin: userDoc._id,
        members: [userDoc._id],
      });
      teamId = teamDoc._id;

      const eventDoc = await EventModel.create({
        admin: userId,
        team: teamId,
        title: 'title',
        startDate: startDate,
        endDate: endDate,
      });
      eventId = eventDoc._id.toString();
    });

    it('Virtual field check', async () => {
      const eventDoc = await EventModel.findById(eventId);
      expect(eventDoc.availability.potentialTimes).toBeTruthy();
    });

    it('splitDays with single day', async () => {
      const startDate = new Date('2022-05-10T22:37:38.007Z');
      const endDate = new Date('2022-05-10T23:39:38.007Z');
      const splits = splitDays(startDate, endDate);
      expect(splits).toEqual([{ startDate, endDate }]); // Time bracket remains unchanged
    });

    it('splitDays with two days', async () => {
      const startDate = new Date('2022-05-10T22:37:38.007Z');
      const endDate = new Date('2022-05-11T23:39:38.007Z');
      const splits = splitDays(startDate, endDate);
      expect(splits).toEqual([
        {
          startDate,
          endDate: new Date('2022-05-10T23:39:38.007Z'),
        },
        {
          startDate: new Date('2022-05-11T22:37:38.007Z'),
          endDate,
        },
      ]); // Time bracket split
    });

    it('splitDays with three days', async () => {
      const startDate = new Date('2022-05-10T22:37:38.007Z');
      const endDate = new Date('2022-05-12T23:39:38.007Z');
      const splits = splitDays(startDate, endDate);
      expect(splits).toEqual([
        {
          startDate,
          endDate: new Date('2022-05-10T23:39:38.007Z'),
        },
        {
          startDate: new Date('2022-05-11T22:37:38.007Z'),
          endDate: new Date('2022-05-11T23:39:38.007Z'),
        },
        {
          startDate: new Date('2022-05-12T22:37:38.007Z'),
          endDate,
        },
      ]); // Time bracket split
    });

    it.skip('splitDays with multiple days with and dates at start of day', async () => {
      const dateOffset = 24 * 60 * 60 * 1000 * 2; //2 days
      const startDate = new Date('2022'); // The start of 2022
      let endDate = new Date();
      endDate.setTime(startDate.getTime() + dateOffset);

      const splits = splitDays(startDate, endDate);
      expect(splits).toEqual([
        {
          startDate,
          endDate: new Date('2022-01-02T00:00:00.000Z'),
        },
        {
          endDate: new Date('2022-01-02T00:00:00.000Z'),
          startDate: new Date('2022-01-03T00:00:00.000Z'),
        },
      ]); // Time bracket split
    });

    it('Add user availability (single day)', async () => {});

    it.skip('Add user availability (multiple days)', async () => {
      const spy = jest.spyOn(server.webSocket, 'send');

      // Create an availability of 2 days
      const dateOffset = 24 * 60 * 60 * 1000 * 2; //2 days
      const availabilityStartTime = new Date('1950');
      let availabilityEndTime = new Date();
      availabilityEndTime.setTime(availabilityStartTime.getTime() + dateOffset);

      const eventResponseDTO: EventResponseDTO = (
        await request(server)
          .post(`/api/v1/event/${eventId}/availability`)
          .send({
            userId,
            startDate: availabilityStartTime,
            endDate: availabilityEndTime,
            status: AvailabilityStatus.Available,
          })
          .expect(StatusCodes.OK)
      ).body;

      const attendeeAvailability =
        eventResponseDTO.availability.attendeeAvailability;
      expect(attendeeAvailability).toHaveLength(1);
      expect(attendeeAvailability[0].attendee).toEqual(userId);

      expect(attendeeAvailability[0].availability).toHaveLength(2);
      // Start date
      expect(attendeeAvailability[0].availability[1].startDate).toEqual(
        availabilityStartTime.toISOString(),
      );
      // end of starting day
      // expect(attendeeAvailability[0].availability[1].endDate).toEqual(
      //   availabilityStartTime.toISOString(),
      // );

      // expect(attendeeAvailability[0].availability[1].endDate).toEqual(
      //   endDate.toISOString(),
      // );
      // expect(attendeeAvailability[0].availability[1].status).toEqual(
      //   AvailabilityStatus.Available,
      // );
      expect(spy).toHaveBeenCalled();
    });

    it.skip('Remove user availability entirely', async () => {
      const spy = jest.spyOn(server.webSocket, 'send');

      await request(server)
        .delete(
          `/api/v1/event/${eventId}/availability?userId=${userId}&startDate=${new Date(
            '1800',
          ).toISOString()}&endDate=${new Date('2100').toISOString()}`,
        )
        .expect(StatusCodes.OK);

      const eventDoc = await EventModel.findById(eventId);

      expect(
        eventDoc.availability.attendeeAvailability[0].availability,
      ).toHaveLength(0);
      expect(spy).toHaveBeenCalled();
    });

    it.skip('Remove user availability left side', async () => {
      const spy = jest.spyOn(server.webSocket, 'send');

      await request(server)
        .delete(
          `/api/v1/event/${eventId}/availability?userId=${userId}&startDate=${new Date(
            '1850',
          ).toISOString()}&endDate=${new Date('1950').toISOString()}`,
        )
        .expect(StatusCodes.OK);

      const eventDoc = await EventModel.findById(eventId);
      expect(eventDoc.availability.attendeeAvailability).toHaveLength(1);
      expect(
        eventDoc.availability.attendeeAvailability[0].availability,
      ).toHaveLength(1);
      expect(
        eventDoc.availability.attendeeAvailability[0].availability[0].startDate,
      ).toEqual(new Date('1950'));
      expect(
        eventDoc.availability.attendeeAvailability[0].availability[0].endDate,
      ).toEqual(endDate);

      expect(spy).toHaveBeenCalled();
    });

    it.skip('Remove user availability right side', async () => {
      const spy = jest.spyOn(server.webSocket, 'send');

      await request(server)
        .delete(
          `/api/v1/event/${eventId}/availability?userId=${userId}&startDate=${new Date(
            '1950',
          ).toISOString()}&endDate=${new Date('2100').toISOString()}`,
        )
        .expect(StatusCodes.OK);

      const eventDoc = await EventModel.findById(eventId);
      expect(eventDoc.availability.attendeeAvailability).toHaveLength(1);
      expect(
        eventDoc.availability.attendeeAvailability[0].availability,
      ).toHaveLength(1);
      expect(
        eventDoc.availability.attendeeAvailability[0].availability[0].startDate,
      ).toEqual(startDate);
      expect(
        eventDoc.availability.attendeeAvailability[0].availability[0].endDate,
      ).toEqual(new Date('1950'));
      expect(spy).toHaveBeenCalled();
    });

    it.skip('Remove user availability middle', async () => {
      const spy = jest.spyOn(server.webSocket, 'send');

      await request(server)
        .delete(
          `/api/v1/event/${eventId}/availability?userId=${userId}&startDate=${new Date(
            '1940',
          ).toISOString()}&endDate=${new Date('1960').toISOString()}`,
        )
        .expect(StatusCodes.OK);

      const eventDoc = await EventModel.findById(eventId);
      expect(eventDoc.availability.attendeeAvailability).toHaveLength(1);
      expect(
        eventDoc.availability.attendeeAvailability[0].availability,
      ).toHaveLength(2);

      // Left block
      expect(
        eventDoc.availability.attendeeAvailability[0].availability[0].startDate,
      ).toEqual(startDate);
      expect(
        eventDoc.availability.attendeeAvailability[0].availability[0].endDate,
      ).toEqual(new Date('1940'));

      // Right Block
      expect(
        eventDoc.availability.attendeeAvailability[0].availability[1].startDate,
      ).toEqual(new Date('1960'));
      expect(
        eventDoc.availability.attendeeAvailability[0].availability[1].endDate,
      ).toEqual(endDate);

      expect(spy).toHaveBeenCalled();
    });

    it('Attempt to add availability for a member not part of event team', async () => {
      const secondUser = await UserModel.create({
        _id: 'y'.repeat(25),
        firstName: 'second',
        lastName: 'user',
      });

      expect(async () => {
        await request(server)
          .post(`/api/v1/event/${eventId}/availability`)
          .send({
            userId: secondUser._id,
            startDate,
            endDate,
            status: AvailabilityStatus.Available,
          })
          .expect(StatusCodes.BAD_REQUEST);
      }).rejects.toThrow();
    });

    describe('Socket io test', () => {
      let io: Server;
      let serverSocket: Socket;
      let clientSocket;

      beforeAll((done) => {
        const httpServer = createServer();
        io = new Server(httpServer);

        httpServer.listen(() => {
          const port = (<AddressInfo>httpServer.address()).port;

          clientSocket = Client(`http://localhost:${port}`);

          io.on('connection', (socket) => {
            serverSocket = socket;
          });
          clientSocket.on('connect', done);
        });
      });

      afterAll(() => {
        io.close();
        clientSocket.close();
      });

      test('Socket IO connection', () => {
        clientSocket.on(`test`, (arg) => {
          expect(arg).toBe('TEST MESSAGE');
        });

        serverSocket.emit('test', 'TEST MESSAGE');
      });
    });
  });
});
