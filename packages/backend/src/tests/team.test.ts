import server from '../app';
import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { UserModel } from '../schemas/user.schema';
import { TeamModel } from '../schemas/team.schema';
import { Colour } from '../schemas/team.schema';
import { identifier } from '../service/event.service';

describe('Team', () => {
  let adminDoc;
  beforeEach(async () => {
    adminDoc = await UserModel.create({
      _id: identifier(32),
      firstName: 'firstName',
      lastName: 'lastName',
    });
  });
  it('Get', async () => {
    const teamDoc = await TeamModel.create({
      title: 'title',
      admin: adminDoc._id,
    });
    const teamId = teamDoc._id.toString();
    const teamGetResponse = await request(server)
      .get(`/api/v1/team/${teamId}`)
      .expect(StatusCodes.OK);

    expect(teamGetResponse.body.id).toEqual(teamId);
  });

  it('Create', async () => {
    await request(server)
      .post('/api/v1/team')
      .send({
        title: 'title',
        color: Colour.BLUE,
        admin: adminDoc._id,
      })
      .expect(StatusCodes.CREATED);
  });

  it('Update', async () => {
    const teamDoc = await TeamModel.create({
      title: 'title',
      admin: adminDoc._id,
    });
    const teamId = teamDoc._id.toString();

    const userUpdateResponse = await request(server)
      .patch(`/api/v1/team/${teamId}`)
      .send({
        title: 'changed',
      })
      .expect(StatusCodes.OK);

    expect(userUpdateResponse.body.title).toEqual('changed');
  });

  it('Delete', async () => {
    const teamDoc = await TeamModel.create({
      title: 'title',
      admin: adminDoc._id,
    });
    const teamId = teamDoc._id.toString();
    await request(server)
      .delete(`/api/v1/team/${teamId}`)
      .expect(StatusCodes.NO_CONTENT);

    expect(await TeamModel.findById(teamId)).toBeNull();
  });

  it('Add member to team', async () => {
    const teamDoc = await TeamModel.create({
      title: 'title',
      admin: adminDoc._id,
    });
    const teamId = teamDoc._id.toString();

    const userDoc = await UserModel.create({
      _id: 'x'.repeat(28), // firebaseId
      firstName: 'firstName',
      lastName: 'lastName',
    });

    const userId = userDoc._id.toString();

    await request(server)
      .put(`/api/v1/team/${teamId}/member`)
      .send({ userId })
      .expect(StatusCodes.OK);

    const teamDoc2 = await TeamModel.findById(teamId);
    expect(teamDoc2.members).toContain(userId);
  });
});
