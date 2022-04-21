import app from '../app';
import request from 'supertest';
import {
  AvailabilityStatus,
  EventModel,
  EventStatus,
  IEventAvailability,
} from '../schemas/event.schema';
import { StatusCodes } from 'http-status-codes';
import { identifier } from '../models/models.module';
import { UserModel } from '../schemas/user.schema';
import { EventResponseDTO } from 'src/controllers/event.controller';

describe('Events', () => {
  it('Get', async () => {
    const eventDoc = await EventModel.create({
      title: 'title',
      description: 'description',
      status: EventStatus.Accepted,
      startDate: 0,
      endDate: 0,
      availability: {} as IEventAvailability,
      attendees: ['01234e357ec3446e40e1b29b'],
      location: 'location',
    });

    const eventId = eventDoc._id.toString();
    const eventGetResponse = await request(app)
      .get(`/api/v1/event`)
      .send({ eventId })
      .expect(StatusCodes.OK);

    expect(eventGetResponse.body.id).toEqual(eventId);
  });

  it('Create', async () => {
    await request(app)
      .post('/api/v1/event')
      .send({
        title: 'title',
        description: 'description',
        status: EventStatus.Accepted,
        startDate: 0,
        endDate: 0,
        availability: {} as IEventAvailability,
        attendees: ['01234e357ec3446e40e1b29b'],
        location: 'location',
      })
      .expect(StatusCodes.CREATED);
  });

  it('Update', async () => {
    const eventDoc = await EventModel.create({
      title: 'title',
      description: 'description',
      status: EventStatus.Accepted,
      startDate: 0,
      endDate: 0,
      availability: {} as IEventAvailability,
      attendees: ['01234e357ec3446e40e1b29b'],
      location: 'location',
    });

    const eventId = eventDoc._id.toString();
    const eventUpdateResponse = await request(app)
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
      status: EventStatus.Accepted,
      startDate: 0,
      endDate: 0,
      availability: {} as IEventAvailability,
      attendees: ['01234e357ec3446e40e1b29b'],
      location: 'location',
    });

    await request(app)
      .delete(`/api/v1/event`)
      .send({ eventId: eventDoc._id })
      .expect(StatusCodes.NO_CONTENT);
  });

  it('Generate random identifier', async () => {
    expect(identifier(10)).toHaveLength(10);
  });

  describe('User availability', () => {
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
        status: EventStatus.Accepted,
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
        attendees: [userDoc._id],
        location: 'location',
      });
      eventId = eventDoc._id.toString();
    });

    it('Add user availability', async () => {
      const eventResponseDTO: EventResponseDTO = (
        await request(app)
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
      await request(app)
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
      await request(app)
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
      await request(app)
        .delete(`/api/v1/event/availability`)
        .send({
          eventId,
          userId,
          startDate: new Date('1950'),
          endDate: new Date('2100'),
          status: AvailabilityStatus.Available,
        })
        .expect(StatusCodes.OK);

      // Refresh document
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
      await request(app)
        .delete(`/api/v1/event/availability`)
        .send({
          eventId,
          userId,
          startDate: new Date('1940'),
          endDate: new Date('1960'),
          status: AvailabilityStatus.Available,
        })
        .expect(StatusCodes.OK);

      // Refresh document
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
  });
});
