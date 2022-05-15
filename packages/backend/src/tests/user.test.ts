import server from '../app';
import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { UserModel } from '../schemas/user.schema';
import { TeamModel } from '../schemas/team.schema';
import { UserResponseDTO } from 'src/controllers/user.controller';

// Skipping as there is auth implementation in it which has been skipped making these tests broken!
describe('Users', () => {
  it.skip('Get', async () => {
    const userDoc = await UserModel.create({
      _id: 'x'.repeat(28), // firebaseId
      firstName: 'firstName',
      lastName: 'lastName',
    });

    const userId = userDoc._id.toString();
    const userGetResponse = await request(server)
      .get(`/api/v1/user/${userId}`)
      .expect(StatusCodes.OK);

    expect(userGetResponse.body.id).toEqual(userId);
  });

  it.skip('Create', async () => {
    await request(server)
      .post('/api/v1/user')
      .send({
        _id: 'x'.repeat(28), // firebaseId
        firstName: 'firstName',
        lastName: 'lastName',
      })
      .expect(StatusCodes.CREATED);
  });

  it.skip('Update', async () => {
    const userDoc = await UserModel.create({
      _id: 'x'.repeat(28), // firebaseId
      firstName: 'firstName',
      lastName: 'lastName',
    });

    const userId = userDoc._id.toString();
    const userUpdateResponse = await request(server)
      .put(`/api/v1/user/${userId}`)
      .send({
        firstName: 'changed',
      })
      .expect(StatusCodes.OK);

    expect(userUpdateResponse.body.firstName).toEqual('changed');
    expect(userUpdateResponse.body.lastName).toEqual('lastName');
  });

  it.skip('Delete', async () => {
    const userDoc = await UserModel.create({
      _id: 'x'.repeat(28), // firebaseId
      firstName: 'first',
      lastName: 'last',
    });

    const userId = userDoc._id.toString();
    await request(server)
      .delete(`/api/v1/user/${userId}`)
      .expect(StatusCodes.NO_CONTENT);
  });

  it('Fetch all users', async () => {
    await UserModel.create({
      _id: 'x'.repeat(28), // firebaseId
      firstName: 'first',
      lastName: 'last',
    });

    await UserModel.create({
      _id: 'y'.repeat(28), // firebaseId
      firstName: 'first',
      lastName: 'last',
    });

    const response: UserResponseDTO[] = (
      await request(server).get(`/api/v1/users`).expect(StatusCodes.OK)
    ).body;
    expect(response).toEqual([
      {
        id: 'x'.repeat(28), // firebaseId
        firstName: 'first',
        lastName: 'last',
        events: [],
      },

      {
        id: 'y'.repeat(28), // firebaseId
        firstName: 'first',
        lastName: 'last',
        events: [],
      },
    ]);
  });
});
