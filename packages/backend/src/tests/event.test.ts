import app from '../app';
import request from 'supertest';
import {
  EventModel,
  EventStatus,
  IEventAvailability,
} from '../schemas/event.schema';
import { StatusCodes } from 'http-status-codes';

describe('Events', () => {
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

    const eventId = eventDoc._id.toString();
    await request(app)
      .delete(`/api/v1/event/${eventId}`)
      .expect(StatusCodes.NO_CONTENT);
  });
});
