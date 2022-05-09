import server from '../app';
import request from 'supertest';
import { AvailabilityStatus, EventModel } from '../schemas/event.schema';
import { StatusCodes } from 'http-status-codes';
import { UserModel } from '../schemas/user.schema';
import { TeamModel } from '../schemas/team.schema';
import { EventResponseDTO } from '../controllers/event.controller';
import { createServer, Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import Client from 'socket.io-client';
import { AddressInfo } from 'net';

describe.only('Events', () => {
  it('Get', async () => {
    const eventDoc = await EventModel.create({
      admin: 'x'.repeat(25),
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

  it('Create', async () => {
    const createResponse = await request(server)
      .post('/api/v1/event')
      .send({
        admin: 'x'.repeat(25),
        title: 'title',
        startDate: new Date('1900'),
        endDate: new Date('2000'),
      })
      .expect(StatusCodes.CREATED);

    expect(
      await EventModel.exists({ _id: createResponse.body.id }),
    ).toBeTruthy();
  });

  it('Patch', async () => {
    const spy = jest.spyOn(server.webSocket, 'send');

    const eventDoc = await EventModel.create({
      admin: 'x'.repeat(25),
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
      admin: 'x'.repeat(25),
    });
    const eventId = eventDoc._id.toString();

    await request(server)
      .delete(`/api/v1/event/${eventId}`)
      .expect(StatusCodes.NO_CONTENT);

    expect(await EventModel.exists({ _id: eventId })).toBe(null);
  });

  describe('Search', () => {
    let userId, teamId, eventId;

    beforeEach(async () => {
      const userDoc = await UserModel.create({
        _id: 'x'.repeat(25),
        firstName: 'firstName',
        lastName: 'lastName',
      });
      userId = userDoc._id;

      const teamDoc = await TeamModel.create({
        title: 'title',
        description: 'description',
        admin: userId,
      });
      teamId = teamDoc._id;

      const eventDoc = await EventModel.create({
        title: 'title',
        description: 'description',
        startDate: new Date('1900'),
        endDate: new Date('2000'),
        team: teamId,
        admin: userId,
      });
      eventId = eventDoc._id;
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

      expect(searchResponse).toHaveLength(1);
      expect(searchResponse[0].id).toBe(eventId.toString());
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

      expect(searchResponse).toHaveLength(1);
      expect(searchResponse[0].id).toBe(eventId.toString());
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

      expect(searchResponse).toHaveLength(1);
      expect(searchResponse[0].id).toBe(eventId.toString());
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
        availability: {
          potentialTimes: [],
          finalisedTime: { startDate: startDate, endDate: endDate },
          attendeeAvailability: [
            {
              attendee: userDoc._id,
              availability: [
                {
                  startDate: startDate,
                  endDate: endDate,
                  status: AvailabilityStatus.Available,
                },
              ],
            },
          ],
        },
      });
      eventId = eventDoc._id.toString();
    });

    it('Virtual field check', async () => {
      const eventDoc = await EventModel.findById(eventId);
      expect(eventDoc.availability.potentialTimes).toBeTruthy();
    });

    it('Add user availability', async () => {
      const spy = jest.spyOn(server.webSocket, 'send');

      const eventResponseDTO: EventResponseDTO = (
        await request(server)
          .post(`/api/v1/event/${eventId}/availability`)
          .send({
            userId,
            startDate,
            endDate,
            status: AvailabilityStatus.Available,
          })
          .expect(StatusCodes.OK)
      ).body;

      const attendeeAvailability =
        eventResponseDTO.availability.attendeeAvailability;
      expect(attendeeAvailability).toHaveLength(1);
      expect(attendeeAvailability[0].attendee).toEqual(userId.toString());
      expect(attendeeAvailability[0].availability).toHaveLength(2);
      expect(attendeeAvailability[0].availability[1].startDate).toEqual(
        startDate.toISOString(),
      );
      expect(attendeeAvailability[0].availability[1].endDate).toEqual(
        endDate.toISOString(),
      );
      expect(attendeeAvailability[0].availability[1].status).toEqual(
        AvailabilityStatus.Available,
      );
      expect(spy).toHaveBeenCalled();
    });

    it('Remove user availability entirely', async () => {
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

    it('Remove user availability left side', async () => {
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

    it('Remove user availability right side', async () => {
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

    it('Remove user availability middle', async () => {
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
