import { Colour, ITeam, TeamModel } from '../schemas/team.schema';
import { Request, Response } from 'express';
import { TypedRequestBody } from '../libs/utils.lib';
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

interface UpdateTeamDTO extends Partial<ITeam> {}

export async function getTeamById(
  req: Request,
  res: Response<TeamResponseDTO>,
) {
  try {
    const teamId = req.params.teamId;

    const rules = Joi.object<{ teamId: string }>({
      teamId: validators.id().required(),
    });
    const formData = validate(res, rules, { teamId }, { allowUnknown: true });

    const teamDoc = await TeamModel.findById(formData.teamId);
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
      description: validators.description().optional(),
      admin: validators.id().required(),
      members: validators.ids().optional(),
      events: validators.ids().optional(),
    });
    const formData = validate(res, rules, req.body, { allowUnknown: true });

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
  req: TypedRequestBody<UpdateTeamDTO>,
  res: Response<TeamResponseDTO>,
) {
  // TODO: create/use remainder of validation rules
  try {
    const teamId = req.params.teamId;
    const rules = Joi.object<UpdateTeamDTO & { teamId: string }>({
      teamId: validators.id().required(),
      title: validators.title().optional(),
      description: validators.description().optional(),
      admin: validators.id().optional(),
      members: validators.ids().optional(),
      events: validators.ids().optional(),
    });
    const formData = validate(
      res,
      rules,
      { ...req.body, teamId },
      { allowUnknown: true },
    );

    const teamDoc = await TeamModel.findOneAndUpdate(
      { _id: formData.teamId },
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
    const teamId = req.params.teamId;

    const rules = Joi.object<{ teamId: string }>({
      teamId: validators.id().required(),
    });
    const formData = validate(res, rules, { teamId }, { allowUnknown: true });

    const result = await TeamModel.deleteOne({ _id: formData.teamId });
    if (result.deletedCount === 0) {
      return returnError(Error('Team Not Found'), res, StatusCodes.NOT_FOUND);
    }

    res.sendStatus(StatusCodes.NO_CONTENT);
  } catch (err) {
    returnError(err, res);
  }
}
