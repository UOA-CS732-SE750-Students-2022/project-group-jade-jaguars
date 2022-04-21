import { Colour, ITeam, TeamModel } from '../schemas/team.schema';
import { Request, Response } from 'express';
import { Types } from 'mongoose';
import {
  convertToObjectId,
  ServerError,
  TypedRequestBody,
} from '../libs/utils.lib';
import Joi from 'joi';
import { validate, validators } from '../libs/validate.lib';
import { StatusCodes } from 'http-status-codes';

interface CreateTeamDTO {
  title: string;
  description?: string;
  color?: Colour;
  admin: Types.ObjectId;
  members?: Types.ObjectId[];
  events?: Types.ObjectId[];
}

interface TeamResponseDTO {
  id: Types.ObjectId;
  title: string;
  description: string;
  color: Colour;
  admin: Types.ObjectId;
  members: Types.ObjectId[];
  events: Types.ObjectId[];
}

interface UpdateUserDTO extends Partial<ITeam> {}

export async function getTeamById(
  req: Request,
  res: Response<TeamResponseDTO>,
) {
  const teamId = convertToObjectId(req.params.id);
  const teamDoc = await TeamModel.findById(teamId);
  if (!teamDoc) {
    throw new ServerError('team not found', StatusCodes.NOT_FOUND);
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
}

export async function createTeam(
  req: TypedRequestBody<CreateTeamDTO>,
  res: Response<TeamResponseDTO>,
) {
  const rules = Joi.object<CreateTeamDTO>({
    title: validators.title().required(),
    description: validators.description().required(),
    admin: validators.objectId().required(),
    members: validators.objectIds().optional(),
    events: validators.objectIds().optional(),
  });

  const formData = validate(rules, req.body, { allowUnknown: true });

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
}

export async function updateTeamById(
  req: TypedRequestBody<UpdateUserDTO>,
  res: Response<TeamResponseDTO>,
) {
  // TODO: create/use remainder of validation rules
  const rules = Joi.object<UpdateUserDTO>({
    title: validators.title().optional(),
    description: validators.description().optional(),
    admin: validators.objectId().optional(),
    members: validators.objectIds().optional(),
    events: validators.objectIds().optional(),
  });
  const formData = validate(rules, req.body, { allowUnknown: true });

  const teamId = convertToObjectId(req.params.id);
  const teamDoc = await TeamModel.findOneAndUpdate(
    { _id: teamId },
    { $set: formData },
    { new: true },
  );

  if (!teamDoc) {
    throw new ServerError('team not found', StatusCodes.BAD_REQUEST);
  } else {
    res.status(StatusCodes.OK).send({
      id: teamDoc._id,
      title: teamDoc.title,
      description: teamDoc.description,
      color: teamDoc.color,
      admin: teamDoc.admin,
      members: teamDoc.members,
      events: teamDoc.events,
    });
  }
}

export async function deleteTeamById(req: Request, res: Response) {
  // TODO: Add auth middleware to this
  const teamId = convertToObjectId(req.params.id);
  const result = await TeamModel.deleteOne({ _id: teamId });
  if (result.deletedCount === 0) {
    throw new ServerError('team not found', StatusCodes.NOT_FOUND, result);
  } else {
    res.status(StatusCodes.NO_CONTENT).send();
  }
}

export async function addMemberById(req: Request, res: Response) {
  // TODO: Add auth middleware to this
  const teamId = convertToObjectId(req.params.id);
  const result = await TeamModel.deleteOne({ _id: teamId });
  if (result.deletedCount === 0) {
    throw new ServerError('team not found', StatusCodes.NOT_FOUND, result);
  } else {
    res.status(StatusCodes.NO_CONTENT).send();
  }
}
