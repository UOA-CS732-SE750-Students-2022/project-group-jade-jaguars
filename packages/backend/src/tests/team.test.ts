import app from '../app';
import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { UserModel } from '../schemas/user.schema';
import { TeamModel } from '../schemas/team.schema';
import { Colour } from '../schemas/team.schema';

describe.skip('Team', () => {
  let adminDoc;
  beforeEach(async () => {
    adminDoc = await UserModel.create({
      firstName: 'firstName',
      lastName: 'lastName',
    });
  });
  it('Get', async () => {
    const teamDoc = await TeamModel.create({
      title: 'title',
      description: 'description',
      admin: adminDoc._id,
    });
    const teamId = teamDoc._id.toString();
    const teamGetResponse = await request(app)
      .get(`/api/v1/team/${teamId}`)
      .expect(StatusCodes.OK);

    expect(teamGetResponse.body.id).toEqual(teamId);
  });

  it('Create', async () => {
    await request(app)
      .post('/api/v1/team')
      .send({
        title: 'title',
        description: 'description',
        color: Colour.BLUE,
        admin: adminDoc._id,
      })
      .expect(StatusCodes.CREATED);
  });

  it('Update', async () => {
    const teamDoc = await TeamModel.create({
      title: 'title',
      description: 'description',
      admin: adminDoc._id,
    });
    const teamId = teamDoc._id.toString();

    const userUpdateResponse = await request(app)
      .put(`/api/v1/team/${teamId}`)
      .send({
        title: 'changed',
      })
      .expect(StatusCodes.OK);

    expect(userUpdateResponse.body.title).toEqual('changed');
    expect(userUpdateResponse.body.description).toEqual('description');
  });

  it('Delete', async () => {
    const teamDoc = await TeamModel.create({
      title: 'title',
      description: 'description',
      admin: adminDoc._id,
    });
    const teamId = teamDoc._id.toString();
    await request(app)
      .delete(`/api/v1/team/${teamId}`)
      .expect(StatusCodes.NO_CONTENT);

    expect(await TeamModel.findById(teamId)).toBeNull();
  });
});
