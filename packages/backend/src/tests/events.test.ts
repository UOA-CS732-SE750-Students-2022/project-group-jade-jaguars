import app from '../app';
import request from 'supertest';
import { EventStatus } from '../schemas/events.schema';
import { StatusCodes } from 'http-status-codes';

describe('Events', () => {
  it('Get', async () => {
    const eventCreateResponse = await request(app)
      .post('/api/v1/event')
      .send({
        startTime: 0,
        title: 'asdf',
        status: EventStatus.Accepted,
        endTime: 0,
        attendees: ['01234e357ec3446e40e1b29b'],
        description: ['comment1'],
        location: 'location1',
      })
      .expect(StatusCodes.CREATED);

    const eventId = eventCreateResponse.body.id;

    const eventGetResponse = await request(app)
      .get(`/api/v1/event/${eventId}`)
      .expect(StatusCodes.OK);

    expect(eventGetResponse.body.id).toEqual(eventId);
  });
  it('Create', async () => {
    await request(app)
      .post('/api/v1/event')
      .send({
        startTime: 0,
        title: 'asdf',
        status: EventStatus.Accepted,
        endTime: 0,
        attendees: ['01234e357ec3446e40e1b29b'],
        description: ['comment1'],
        location: 'location1',
      })
      .expect(StatusCodes.CREATED);
  });

  it('Update', async () => {
    const eventCreateResponse = await request(app)
      .post('/api/v1/event')
      .send({
        startTime: 0,
        title: 'asdf',
        status: EventStatus.Accepted,
        endTime: 0,
        attendees: ['01234e357ec3446e40e1b29b'],
        description: ['comment1'],
        location: 'location1',
      })
      .expect(StatusCodes.CREATED);
    const eventId = eventCreateResponse.body.id;

    const eventUpdateResponse = await request(app)
      .put(`/api/v1/event/${eventId}`)
      .send({
        title: 'changed',
      })
      .expect(StatusCodes.OK);

    expect(eventUpdateResponse.body.title).toEqual('changed');
  });
  it('Delete', async () => {
    const eventCreateResponse = await request(app)
      .post('/api/v1/event')
      .send({
        startTime: 0,
        title: 'asdf',
        status: EventStatus.Accepted,
        endTime: 0,
        attendees: ['01234e357ec3446e40e1b29b'],
        description: ['comment1'],
        location: 'location1',
      })
      .expect(StatusCodes.CREATED);

    const eventId = eventCreateResponse.body.id;
    await request(app)
      .delete(`/api/v1/event/${eventId}`)
      .expect(StatusCodes.NO_CONTENT);
  });
});
