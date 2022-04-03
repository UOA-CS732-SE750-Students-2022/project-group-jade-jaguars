import app from '../app';
import request from 'supertest';
import { EventStatus } from '../schemas/events.schema';

describe('Events', () => {
  it('Get', async () => {});
  it.only('Create', async () => {
    // const response = await request(app)
    //   .post('/api/v1/event')
    //   .send({
    //     startTime: 0,
    //     title: 'asdf',
    //     status: EventStatus.Accepted,
    //     endTime: 0,
    //     attendees: '01234e357ec3446e40e1b29b',
    //     description: ['comment1'],
    //     location: 'location1',
    //   });
    // .expect(StatusCodes.OK);
    // console.log(response);
  });
  it('Update', async () => {});
  it('Delete', async () => {});
});
