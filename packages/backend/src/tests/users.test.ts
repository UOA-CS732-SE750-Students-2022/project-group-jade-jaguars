import app from '../app';
import request from 'supertest';
import { StatusCodes } from 'http-status-codes';

describe('Users', () => {
  it('Get', async () => {
    const userCreateResponse = await request(app)
      .post('/api/v1/user')
      .send({
        firstName: 'first',
        lastName: 'last',
      })
      .expect(StatusCodes.CREATED);

    const userId = userCreateResponse.body.id;

    const userGetResponse = await request(app)
      .get(`/api/v1/user/${userId}`)
      .expect(StatusCodes.OK);

    expect(userGetResponse.body.id).toEqual(userId);
  });

  it('Create', async () => {
    await request(app)
      .post('/api/v1/user')
      .send({
        firstName: 'first',
        lastName: 'last',
      })
      .expect(StatusCodes.CREATED);
  });

  it('Update', async () => {
    const userCreateResponse = await request(app)
      .post('/api/v1/user')
      .send({
        firstName: 'first',
        lastName: 'last',
      })
      .expect(StatusCodes.CREATED);

    const userId = userCreateResponse.body.id;

    const userUpdateResponse = await request(app)
      .put(`/api/v1/user/${userId}`)
      .send({
        firstName: 'changed',
      })
      .expect(StatusCodes.OK);

    expect(userUpdateResponse.body.firstName).toEqual('changed');
    expect(userUpdateResponse.body.lastName).toEqual('last');
  });

  it('Delete', async () => {
    const userCreateResponse = await request(app)
      .post('/api/v1/user')
      .send({
        firstName: 'first',
        lastName: 'last',
      })
      .expect(StatusCodes.CREATED);
    const userId = userCreateResponse.body.id;
    await request(app)
      .delete(`/api/v1/user/${userId}`)
      .expect(StatusCodes.NO_CONTENT);
  });
});
