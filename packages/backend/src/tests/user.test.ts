import app from '../app';
import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { UserModel } from '../schemas/user.schema';

describe('Users', () => {
  it('Get', async () => {
    const userDoc = await UserModel.create({
      firstName: 'firstName',
      lastName: 'lastName',
    });

    const userId = userDoc._id.toString();
    const userGetResponse = await request(app)
      .get(`/api/v1/user/${userId}`)
      .expect(StatusCodes.OK);

    expect(userGetResponse.body.id).toEqual(userId);
  });

  it('Create', async () => {
    await request(app)
      .post('/api/v1/user')
      .send({
        firstName: 'firstName',
        lastName: 'lastName',
      })
      .expect(StatusCodes.CREATED);
  });

  it('Update', async () => {
    const userDoc = await UserModel.create({
      firstName: 'firstName',
      lastName: 'lastName',
    });

    const userId = userDoc._id.toString();
    const userUpdateResponse = await request(app)
      .put(`/api/v1/user/${userId}`)
      .send({
        firstName: 'changed',
      })
      .expect(StatusCodes.OK);

    expect(userUpdateResponse.body.firstName).toEqual('changed');
    expect(userUpdateResponse.body.lastName).toEqual('lastName');
  });

  it('Delete', async () => {
    const userDoc = await UserModel.create({
      firstName: 'first',
      lastName: 'last',
    });

    const userId = userDoc._id.toString();
    await request(app)
      .delete(`/api/v1/user/${userId}`)
      .expect(StatusCodes.NO_CONTENT);
  });
});
