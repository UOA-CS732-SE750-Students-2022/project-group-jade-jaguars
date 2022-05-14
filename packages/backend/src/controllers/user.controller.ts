import { getFirebaseUser } from '../libs/middleware.lib';
import { IUser, UserModel } from '../schemas/user.schema';
import { Request, Response } from 'express';
import { TypedRequestBody } from '../libs/utils.lib';
import Joi from 'joi';
import { validate, validators } from '../libs/validate.lib';
import { StatusCodes } from 'http-status-codes';
import { returnError } from '../libs/error.lib';
import { ITeam, TeamModel } from '../schemas/team.schema';
import { EventModel } from '../schemas/event.schema';
import ical from 'ical-generator';

interface CreateUserDTO {
  firstName: string;
  _id: string;
  lastName: string;
  email?: string;
  events?: String[];
}

export interface UserResponseDTO {
  id: string;
  firstName: string;
  lastName: string;
  events: String[];
}

// Allow updates to every field apart from the userId
interface PatchUserDTO extends Partial<Omit<IUser, '_id'>> {}

interface GetUserTeamsResponseDTO {
  teams: ITeam[];
}

export async function getUserById(
  req: Request,
  res: Response<UserResponseDTO>,
) {
  try {
    const firebaseUser = await getFirebaseUser(req, res);
    const userId = req.params.userId;

    const authSelf = firebaseUser.uid === userId;

    const userDoc = await UserModel.findById(userId);
    if (!userDoc) {
      return returnError(Error('User Not Found'), res, StatusCodes.NOT_FOUND);
    }

    res.status(StatusCodes.OK).send({
      id: userDoc._id,
      firstName: userDoc.firstName,
      lastName: userDoc.lastName,
      events: authSelf ? userDoc.events : [],
    });
  } catch (err) {
    returnError(err, res);
  }
}

export async function createUser(
  req: TypedRequestBody<CreateUserDTO>,
  res: Response<UserResponseDTO>,
) {
  try {
    const rules = Joi.object<CreateUserDTO>({
      firstName: validators.firstName().required(),
      lastName: validators.lastName().required(),
    });

    const firebaseUser = await getFirebaseUser(req, res);

    // Test if user already exists
    if (await UserModel.findOne({ _id: firebaseUser.uid })) {
      return returnError(
        Error('User Already Exists'),
        res,
        StatusCodes.CONFLICT,
      );
    }

    const formData = validate(res, rules, req.body, { allowUnknown: true });
    // Validation failed, headers have been set, return
    if (!formData) return;

    // _id corresponds to a prior created firebase ID and cannot be generated
    formData._id = firebaseUser.uid;
    formData.email = firebaseUser.email;

    const userDoc = await UserModel.create(formData);

    res.status(StatusCodes.CREATED).send({
      id: userDoc._id,
      firstName: userDoc.firstName,
      lastName: userDoc.lastName,
      events: userDoc.events,
    });
  } catch (err) {
    returnError(err, res);
  }
}

export async function patchUserById(
  req: TypedRequestBody<PatchUserDTO>,
  res: Response<UserResponseDTO>,
) {
  try {
    const firebaseUser = await getFirebaseUser(req, res);

    const userId = req.params.userId;
    // TODO: create/use remainder of validation rules
    const rules = Joi.object<PatchUserDTO & { userId: string }>({
      userId: validators.id().required(),
      firstName: validators.firstName().optional(),
      lastName: validators.lastName().optional(),
    });
    const formData = validate(
      res,
      rules,
      { ...req.body, userId },
      { allowUnknown: true },
    );
    // Validation failed, headers have been set, return
    if (!formData) return;

    if (firebaseUser.uid !== formData.userId) {
      // return Not found as its more secure to not tell the user if the UID exists or not
      return returnError(Error('User Not Found'), res);
    }

    const userDoc = await UserModel.findOneAndUpdate(
      { _id: formData.userId },
      { $set: formData },
      { new: true },
    );

    if (!userDoc) {
      return returnError(Error('User Not Found'), res);
    }

    res.status(StatusCodes.OK).send({
      id: userDoc._id,
      firstName: userDoc.firstName,
      lastName: userDoc.lastName,
      events: userDoc.events,
    });
  } catch (err) {
    returnError(err, res);
  }
}

export async function deleteUserById(req: Request, res: Response) {
  try {
    const firebaseUser = await getFirebaseUser(req, res);
    const userId = req.params.userId;

    if (firebaseUser.uid !== userId) {
      // return Not found as its more secure to not tell the user if the UID exists or not
      return returnError(Error('User Not Found'), res);
    }

    const result = await UserModel.deleteOne({ _id: userId });
    if (result.deletedCount === 0) {
      return returnError(Error('User Not Found'), res);
    }
    res.sendStatus(StatusCodes.NO_CONTENT);
  } catch (err) {
    returnError(err, res);
  }
}

export async function getUserTeamsById(
  req: Request,
  res: Response<GetUserTeamsResponseDTO>,
) {
  try {
    const firebaseUser = await getFirebaseUser(req, res);
    const userId = req.params.userId;

    if (firebaseUser.uid !== userId) {
      // return Not found as its more secure to not tell the user if the UID exists or not
      return returnError(Error('User Not Found'), res);
    }

    // Either the user is the admin or is a member, is an admin a member?
    const teamDocs = await TeamModel.find({
      $or: [{ admin: userId }, { members: userId }],
    });

    if (!teamDocs) {
      return returnError(Error('Cannot Find User Teams'), res);
    } else {
      res.status(StatusCodes.OK).send({
        teams: teamDocs,
      });
    }
  } catch (err) {
    returnError(err, res);
  }
}

export async function getUserCalendar(req: Request, res: Response) {
  try {
    const userId = req.params.userId;

    const userDoc = await UserModel.findOne({ _id: userId });
    if (!userDoc) {
      return returnError(Error('User Not Found'), res);
    }

    const events = userDoc.events;

    const eventDocs = await EventModel.find({
      _id: { $in: events },
    });

    if (!eventDocs) return returnError(Error('Cannot Find User Events'), res);

    // convert to ical

    const calendar = ical({ name: 'Count Me In Calendar' });
    const startTime = new Date();
    const endTime = new Date();
    endTime.setHours(startTime.getHours() + 1);

    eventDocs.forEach((event) => {
      console.log(event);

      calendar.createEvent({
        start: startTime,
        end: endTime,
        summary: event.title,
        description: event.description,
        location: event.location,
      });
    });

    calendar.serve(res);
  } catch (err) {
    returnError(err, res);
  }
}
