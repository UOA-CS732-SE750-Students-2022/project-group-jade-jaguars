import server from '../app';
import request from 'supertest';
import {
  AvailabilityStatus,
  EventModel,
  EventStatus,
} from '../schemas/event.schema';
import { StatusCodes } from 'http-status-codes';
import { identifier } from '../models/models.module';
import { UserModel } from '../schemas/user.schema';
import { TeamModel } from '../schemas/team.schema';
import {
  EventResponseDTO,
  GetEventAvailabilityConfirmationsResponseDTO,
} from 'src/controllers/event.controller';
// import { io } from 'socket.io-client';
import { createServer } from 'http';
import { io as Client } from 'socket.io-client';
import { Server } from 'socket.io';
import { AddressInfo } from 'net';
import socket from '../socketio';
import { BASE_URL } from '../configs/backend.config';

describe('Events', () => {
  it('Get', async () => {
    const eventDoc = await EventModel.create({
      title: 'title',
      description: 'description',
      startDate: new Date('1900'),
      endDate: new Date('2000'),
      location: 'location',
    });

    const eventId = eventDoc._id.toString();
    const eventGetResponse = await request(server)
      .get(`/api/v1/event`)
      .send({ eventId })
      .expect(StatusCodes.OK);

    expect(eventGetResponse.body.id).toEqual(eventId);
  });

  it('Create', async () => {
    await request(server)
      .post('/api/v1/event')
      .send({
        title: 'title',
        description: 'description',
        startDate: new Date('1900'),
        endDate: new Date('2000'),
        location: 'location',
      })
      .expect(StatusCodes.CREATED);
  });

  it('Update', async () => {
    const eventDoc = await EventModel.create({
      title: 'title',
      description: 'description',
      startDate: new Date('1900'),
      endDate: new Date('2000'),
      location: 'location',
    });

    const eventId = eventDoc._id.toString();
    const eventUpdateResponse = await request(server)
      .patch(`/api/v1/event`)
      .send({
        eventId,
        title: 'changed',
      })
      .expect(StatusCodes.OK);

    expect(eventUpdateResponse.body.title).toEqual('changed');
  });

  it('Delete', async () => {
    const eventDoc = await EventModel.create({
      title: 'title',
      description: 'description',
      startDate: new Date('1900'),
      endDate: new Date('2000'),
      location: 'location',
    });
    const eventId = eventDoc._id;

    await request(server)
      .delete(`/api/v1/event`)
      .send({ eventId: eventDoc._id })
      .expect(StatusCodes.NO_CONTENT);

    expect(await EventModel.exists({ _id: eventId })).toBe(null);
  });

  it('Generate random identifier', async () => {
    expect(identifier(10)).toHaveLength(10);
  });

  describe('Search', () => {
    let userId, teamId, eventId;

    beforeEach(async () => {
      const userDoc = await UserModel.create({
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
        location: 'location',
      });
      eventId = eventDoc._id;
    });

    it('By eventId', async () => {
      const searchResponse: EventResponseDTO[] = (
        await request(server)
          .get(`/api/v1/event/search`)
          .send({
            eventId,
          })
          .expect(StatusCodes.OK)
      ).body;

      expect(searchResponse).toHaveLength(1);
      expect(searchResponse[0].id).toBe(eventId.toString());
    });
    it('By teamId', async () => {
      const searchResponse: EventResponseDTO[] = (
        await request(server)
          .get(`/api/v1/event/search`)
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
          .get(`/api/v1/event/search`)
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
          .get(`/api/v1/event/search`)
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
          .get(`/api/v1/event/search`)
          .send({
            startDate: new Date('1800'),
            endDate: new Date('2100'),
          })
          .expect(StatusCodes.OK)
      ).body;

      expect(searchResponse).toHaveLength(1);
      expect(searchResponse[0].id).toBe(eventId.toString());
    });
    it('Limit', async () => {
      // Create a second identical event
      await EventModel.create({
        title: 'title',
        description: 'description',
        startDate: new Date('1900'),
        endDate: new Date('2000'),
        team: teamId,
        location: 'location',
      });

      const searchResponse: EventResponseDTO[] = (
        await request(server)
          .get(`/api/v1/event/search`)
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
    let userId, eventId;

    const startDate = new Date('1900');
    const endDate = new Date('2000');
    beforeEach(async () => {
      const userDoc = await UserModel.create({
        firstName: 'firstName',
        lastName: 'lastName',
      });
      userId = userDoc._id.toString();

      const eventDoc = await EventModel.create({
        title: 'title',
        description: 'description',
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
              confirmed: false,
            },
          ],
        },
        attendees: [userDoc._id],
        location: 'location',
      });
      eventId = eventDoc._id.toString();
    });

    it('Add user availability', async () => {
      const eventResponseDTO: EventResponseDTO = (
        await request(server)
          .post(`/api/v1/event/availability`)
          .send({
            eventId: eventId,
            userId: userId,
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
    });

    it('Remove user availability entirely', async () => {
      await request(server)
        .delete(`/api/v1/event/availability`)
        .send({
          eventId,
          userId,
          startDate,
          endDate,
          status: AvailabilityStatus.Available,
        })
        .expect(StatusCodes.OK);

      const eventDoc = await EventModel.findById(eventId);

      expect(
        eventDoc.availability.attendeeAvailability[0].availability,
      ).toHaveLength(0);
    });

    it('Remove user availability left side', async () => {
      await request(server)
        .delete(`/api/v1/event/availability`)
        .send({
          eventId,
          userId,
          startDate: new Date('1850'),
          endDate: new Date('1950'),
          status: AvailabilityStatus.Available,
        })
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
    });

    it('Remove user availability right side', async () => {
      await request(server)
        .delete(`/api/v1/event/availability`)
        .send({
          eventId,
          userId,
          startDate: new Date('1950'),
          endDate: new Date('2100'),
          status: AvailabilityStatus.Available,
        })
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
    });

    it('Remove user availability middle', async () => {
      await request(server)
        .delete(`/api/v1/event/availability`)
        .send({
          eventId,
          userId,
          startDate: new Date('1940'),
          endDate: new Date('1960'),
          status: AvailabilityStatus.Available,
        })
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
    });

    it('Confirm user availability', async () => {
      await request(server)
        .patch(`/api/v1/event/availability/confirm`)
        .send({
          userId,
          eventId,
          confirmed: true,
        })
        .expect(StatusCodes.OK);

      expect(
        (await EventModel.findById(eventId)).availability
          .attendeeAvailability[0].confirmed,
      ).toBe(true);
    });

    it('Get user availability confirmation count', async () => {
      // Initially the confirmation count will be zero
      const {
        confirmed: confirmedInitial,
      }: GetEventAvailabilityConfirmationsResponseDTO = (
        await request(server)
          .get(`/api/v1/event/availability/confirm`)
          .send({
            userId,
            eventId,
          })
          .expect(StatusCodes.OK)
      ).body;
      expect(confirmedInitial).toBe(0);

      // Create second user
      const secondUser = await UserModel.create({
        firstName: 'firstName',
        lastName: 'lastName',
      });
      const secondUserId = secondUser._id;

      // Create a confirmed availability for second user
      const eventDoc = await EventModel.findById(eventId);
      eventDoc.availability.attendeeAvailability.push({
        attendee: secondUserId,
        availability: [
          {
            startDate: startDate,
            endDate: endDate,
            status: AvailabilityStatus.Available,
          },
        ],
        confirmed: true,
      });
      await eventDoc.save();

      // Check confirmations increases to one
      const {
        confirmed: confirmedFinal,
      }: GetEventAvailabilityConfirmationsResponseDTO = (
        await request(server)
          .get(`/api/v1/event/availability/confirm`)
          .send({
            userId,
            eventId,
          })
          .expect(StatusCodes.OK)
      ).body;

      expect(confirmedFinal).toBe(1);
    });

    // it('Fetch team availability via socket.io', async (done) => {
    //   const socket = io('http://localhost:3000/api/v1/socketio');
    //   socket.connect();
    //   socket.on('connect', () => {
    //     console.log(socket.id);
    //     done();
    //   });
    //   console.log('running test');
    // });

    describe.only('my awesome project', () => {
      let io: Server;
      let serverSocket, clientSocket;

      beforeAll((done) => {
        const httpServer = createServer();
        socket(httpServer, server.app);
        io = server.app.get('socketio');

        httpServer.listen(() => {
          const port = (httpServer.address() as AddressInfo).port;
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

      it('should work', (done) => {
        clientSocket.on('hello', (arg) => {
          expect(arg).toBe('world');
          done();
        });
        serverSocket.emit('hello', 'world');
      });

      it('should work (with ack)', (done) => {
        serverSocket.on('hi', (cb) => {
          cb('hola');
        });
        clientSocket.emit('hi', (arg) => {
          expect(arg).toBe('hola');
          done();
        });
      });
    });
  });
});
