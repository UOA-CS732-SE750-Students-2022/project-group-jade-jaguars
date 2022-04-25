import { getFirebaseUser } from '../libs/middleware.lib';
import { IUser, UserModel } from '../schemas/user.schema';
import { Request, Response } from 'express';
import { ServerError, TypedRequestBody } from '../libs/utils.lib';
import Joi from 'joi';
import { validate, validators } from '../libs/validate.lib';
import { StatusCodes } from 'http-status-codes';

interface CreateUserDTO {
  firstName: string;
  _id: string;
  lastName: string;
  email?: string;
  events?: String[];
}

interface UserResponseDTO {
  id: string;
  firstName: string;
  lastName: string;
  events: String[];
}

interface UpdateUserDTO extends Partial<IUser> {}

export async function getUserById(
  req: Request,
  res: Response<UserResponseDTO>,
) {
  try {
    const firebaseUser = await getFirebaseUser(req, res);
    const userId = req.params.id;

    const authSelf = firebaseUser.uid === userId;

    const userDoc = await UserModel.findById(userId);
    if (!userDoc) {
      throw new ServerError('user not found', StatusCodes.NOT_FOUND);
    }

    res.status(StatusCodes.OK).send({
      id: userDoc._id,
      firstName: userDoc.firstName,
      lastName: userDoc.lastName,
      events: authSelf ? userDoc.events : [],
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
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
      return res.sendStatus(StatusCodes.CONFLICT);
    }

    const formData = validate(rules, req.body, { allowUnknown: true });

    formData._id = firebaseUser.uid;
    formData.email = firebaseUser.email;

    const userDoc = await UserModel.create(formData);

    res.status(StatusCodes.CREATED).send({
      id: userDoc._id,
      firstName: userDoc.firstName,
      lastName: userDoc.lastName,
      events: userDoc.events,
    });
  } catch (error) {
    console.log(error);

    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function updateUserById(
  req: TypedRequestBody<UpdateUserDTO>,
  res: Response<UserResponseDTO>,
) {
  try {
    const firebaseUser = await getFirebaseUser(req, res);

    // TODO: create/use remainder of validation rules
    const rules = Joi.object<UpdateUserDTO>({
      firstName: validators.firstName().optional(),
      lastName: validators.lastName().optional(),
    });
    const formData = validate(rules, req.body, { allowUnknown: true });

    if (firebaseUser.uid !== formData._id) {
      // return Not found as its more secure to not tell the user if the UID exists or not
      return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    const userDoc = await UserModel.findOneAndUpdate(
      { _id: formData._id },
      { $set: formData },
      { new: true },
    );

    if (!userDoc) {
      return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    res.status(StatusCodes.OK).send({
      id: userDoc._id,
      firstName: userDoc.firstName,
      lastName: userDoc.lastName,
      events: userDoc.events,
    });
  } catch (error) {
    console.log(error);

    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function deleteUserById(req: Request, res: Response) {
  try {
    const firebaseUser = await getFirebaseUser(req, res);
    const userId = req.params.id;

    if (firebaseUser.uid !== userId) {
      // return Not found as its more secure to not tell the user if the UID exists or not
      return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    const result = await UserModel.deleteOne({ _id: userId });
    if (result.deletedCount === 0) {
      throw new ServerError('user not found', StatusCodes.NOT_FOUND, result);
    } else {
      res.status(StatusCodes.NO_CONTENT).send();
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
