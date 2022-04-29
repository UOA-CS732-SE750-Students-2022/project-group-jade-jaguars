import { randomUUID } from 'crypto';
import { Colour, ITeam, TeamModel } from '../schemas/team.schema';
import { Request, Response } from 'express';
import { ServerError, TypedRequestBody } from '../libs/utils.lib';
import Joi from 'joi';
import { validate, validators } from '../libs/validate.lib';
import { StatusCodes } from 'http-status-codes';
import { returnError } from '../libs/error.lib';

interface CreateTeamDTO {
  _id: string;
  title: string;
  description?: string;
  color?: Colour;
  admin: string;
  members?: string[];
  events?: string[];
}

interface TeamResponseDTO {
  id: string;
  title: string;
  description: string;
  color: Colour;
  admin: string;
  members: string[];
  events: string[];
}

interface UpdateUserDTO extends Partial<ITeam> {}

export async function getTeamById(
  req: Request,
  res: Response<TeamResponseDTO>,
) {
  try {
    const teamId = req.params.id;
    const teamDoc = await TeamModel.findById(teamId);
    if (!teamDoc) {
      return returnError(Error('Team Not Found'), res, StatusCodes.NOT_FOUND);
    }
    res.status(StatusCodes.OK).send({
      id: teamDoc._id,
      title: teamDoc.title,
      description: teamDoc.description,
      color: teamDoc.color,
      admin: teamDoc.admin,
      members: teamDoc.members,
      events: teamDoc.events,
    });
  } catch (err) {
    returnError(err, res);
  }
}

export async function createTeam(
  req: TypedRequestBody<CreateTeamDTO>,
  res: Response<TeamResponseDTO>,
) {
  try {
    const rules = Joi.object<CreateTeamDTO>({
      title: validators.title().required(),
      description: validators.description().required(),
      admin: validators.objectId().required(),
      members: validators.objectIds().optional(),
      events: validators.objectIds().optional(),
    });

    const formData = validate(rules, req.body, { allowUnknown: true });
    formData._id = randomUUID();

    formData._id = randomUUID();

    const teamDoc = await TeamModel.create(formData);
    res.status(StatusCodes.CREATED).send({
      id: teamDoc._id,
      title: teamDoc.title,
      description: teamDoc.description,
      color: teamDoc.color,
      admin: teamDoc.admin,
      members: teamDoc.members,
      events: teamDoc.events,
    });
  } catch (err) {
    returnError(err, res);
  }
}

export async function updateTeamById(
  req: TypedRequestBody<UpdateUserDTO>,
  res: Response<TeamResponseDTO>,
) {
  try {
    // TODO: create/use remainder of validation rules
    const rules = Joi.object<UpdateUserDTO>({
      title: validators.title().optional(),
      description: validators.description().optional(),
      admin: validators.objectId().optional(),
      members: validators.objectIds().optional(),
      events: validators.objectIds().optional(),
    });
    const formData = validate(rules, req.body, { allowUnknown: true });

    const teamId = req.params.id;
    const teamDoc = await TeamModel.findOneAndUpdate(
      { _id: teamId },
      { $set: formData },
      { new: true },
    );

    if (!teamDoc) {
      return returnError(Error('Team Not Found'), res, StatusCodes.NOT_FOUND);
    }
    res.status(StatusCodes.OK).send({
      id: teamDoc._id,
      title: teamDoc.title,
      description: teamDoc.description,
      color: teamDoc.color,
      admin: teamDoc.admin,
      members: teamDoc.members,
      events: teamDoc.events,
    });
  } catch (err) {
    returnError(err, res);
  }
}

export async function deleteTeamById(req: Request, res: Response) {
  try {
    // TODO: Add auth middleware to this
    const teamId = req.params.id;
    const result = await TeamModel.deleteOne({ _id: teamId });
    if (result.deletedCount === 0) {
      return returnError(Error('Team Not Found'), res, StatusCodes.NOT_FOUND);
    }
    res.sendStatus(StatusCodes.NO_CONTENT);

    // TODO: Add auth middleware to this
  } catch (err) {
    returnError(err, res);
  }
}

export async function addMemberById(req: Request, res: Response) {
  // TODO: Add auth middleware to this
  try {
    const teamId = req.params.id;
    const result = await TeamModel.deleteOne({ _id: teamId });
    if (result.deletedCount === 0) {
      return returnError(Error('Team Not Found'), res, StatusCodes.NOT_FOUND);
    }
    res.sendStatus(StatusCodes.NO_CONTENT);
  } catch (err) {
    returnError(err, res);
  }
}
