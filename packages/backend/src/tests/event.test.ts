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

describe.only('Events', () => {
  it('Get', async () => {
    const eventDoc = await EventModel.create({
      title: 'title',
      description: 'description',
      status: EventStatus.Accepted,
      startTime: 0,
      endTime: 0,
      availability: {} as IEventAvailability,
      attendees: ['01234e357ec3446e40e1b29b'],
      location: 'location',
    });

    const eventId = eventDoc._id.toString();
    const eventGetResponse = await request(app)
      .get(`/api/v1/event/${eventId}`)
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
        startTime: 0,
        endTime: 0,
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
      startTime: 0,
      endTime: 0,
      availability: {} as IEventAvailability,
      attendees: ['01234e357ec3446e40e1b29b'],
      location: 'location',
    });

    const eventId = eventDoc._id.toString();
    const eventUpdateResponse = await request(app)
      .put(`/api/v1/event/${eventId}`)
      .send({
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
      startTime: 0,
      endTime: 0,
      availability: {} as IEventAvailability,
      attendees: ['01234e357ec3446e40e1b29b'],
      location: 'location',
    });

    await request(app)
      .delete(`/api/v1/event/`)
      .send({ id: eventDoc._id })
      .expect(StatusCodes.NO_CONTENT);
  });
  it('Generate random identifier', async () => {
    expect(identifier(10)).toHaveLength(10);
  });
  it('Add user availability', async () => {
    const userDoc = await UserModel.create({
      firstName: 'firstName',
      lastName: 'lastName',
    });
    const userId = userDoc._id.toString();

    const date = new Date(Date.now());
    const eventDoc = await EventModel.create({
      title: 'title',
      description: 'description',
      status: EventStatus.Accepted,
      startTime: date,
      endTime: date,
      attendees: [userId],
      location: 'location',
    });
    const eventId = eventDoc._id.toString();

    const eventResponseDTO: EventResponseDTO = (
      await request(app)
        .post(`/api/v1/event/availability`)
        .send({
          eventId: eventId,
          userId: userId,
          startDate: date,
          endDate: date,
          status: AvailabilityStatus.Available,
        })
        .expect(StatusCodes.OK)
    ).body;

    const attendeeAvailability =
      eventResponseDTO.availability.attendeeAvailability;
    expect(attendeeAvailability).toHaveLength(1);
    expect(attendeeAvailability[0].attendee).toEqual(userId.toString());
    expect(attendeeAvailability[0].availability).toHaveLength(1);
    console.log(attendeeAvailability[0].availability[0]);
    // expect(attendeeAvailability[0].availability[0].startDate).toEqual(date.toString());
    // expect(attendeeAvailability[0].availability[0].endDate).toEqual(`${date}`);
    expect(attendeeAvailability[0].availability[0].status).toEqual(
      AvailabilityStatus.Available,
    );
  });
  it.only('Remove user availability entirely', async () => {
    const userDoc = await UserModel.create({
      firstName: 'firstName',
      lastName: 'lastName',
    });

    // This payload is only valid with startDate < endDate
    const startDate = new Date('1000');
    const endDate = new Date('2000');
    let eventDoc = await EventModel.create({
      title: 'title',
      description: 'description',
      status: EventStatus.Accepted,
      startTime: startDate,
      endTime: endDate,
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

    await request(app)
      .delete(`/api/v1/event/availability`)
      .send({
        eventId: eventDoc._id,
        userId: userDoc._id,
        startDate: startDate,
        endDate: endDate,
        status: AvailabilityStatus.Available,
      })
      .expect(StatusCodes.OK);

    // Refresh document
    eventDoc = await EventModel.findById(eventDoc._id);
    expect(
      eventDoc.availability.attendeeAvailability[0].availability,
    ).toHaveLength(0);
  });
});
