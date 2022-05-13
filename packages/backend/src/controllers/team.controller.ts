import { Colour, ITeam, TeamModel } from '../schemas/team.schema';
import { Request, Response } from 'express';
import { TypedRequestBody } from '../libs/utils.lib';
import Joi from 'joi';
import { validate, validators } from '../libs/validate.lib';
import { StatusCodes } from 'http-status-codes';
import { returnError } from '../libs/error.lib';
import { UserModel } from '../schemas/user.schema';

interface CreateTeamDTO {
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

// Can update all fields but the teamId
interface PatchTeamDTO extends Partial<Omit<ITeam, '_id'>> {}

interface AddMemberDTO {
  userId: string;
}

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
    // Validation failed, headers have been set, return
    if (!formData) return;

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
    // Validation failed, headers have been set, return
    if (!formData) return;

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

export async function patchTeamById(
  req: TypedRequestBody<PatchTeamDTO>,
  res: Response<TeamResponseDTO>,
) {
  // TODO: create/use remainder of validation rules
  try {
    const teamId = req.params.teamId;
    const rules = Joi.object<PatchTeamDTO & { teamId: string }>({
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
    // Validation failed, headers have been set, return
    if (!formData) return;

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
    // Validation failed, headers have been set, return
    if (!formData) return;

    const result = await TeamModel.deleteOne({ _id: formData.teamId });
    if (result.deletedCount === 0) {
      return returnError(Error('Team Not Found'), res, StatusCodes.NOT_FOUND);
    }

    res.sendStatus(StatusCodes.NO_CONTENT);
  } catch (err) {
    returnError(err, res);
  }
}

export async function addMemberById(req: Request, res: Response) {
  try {
    const teamId = req.params.teamId;
    const userId = req.body.userId;
    const rules = Joi.object<AddMemberDTO & { teamId: string }>({
      teamId: validators.id().required(),
      userId: validators.id().required(),
    });

    const formData = validate(
      res,
      rules,
      { teamId, userId },
      { allowUnknown: true },
    );
    // Validation failed, headers have been set, return
    if (!formData) return;

    // Check that the user exists
    if (!(await UserModel.exists({ _id: formData.userId }))) {
      return returnError(Error('User Not Found'), res, StatusCodes.NOT_FOUND);
    }

    // Check that the team exists
    if (!(await TeamModel.exists({ _id: formData.teamId }))) {
      return returnError(Error('Team Not Found'), res, StatusCodes.NOT_FOUND);
    }

    // Add member to the team, note that addToSet means set membership only
    await TeamModel.updateOne(
      { _id: formData.teamId },
      { $addToSet: { members: formData.userId } },
    );

    res.sendStatus(StatusCodes.OK);
  } catch (err) {
    returnError(err, res);
  }
}
