// import { mongoService } from '../services/mongo.service';
import { IUser, UserModel } from '../schemas/user.schema';
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
interface CreateUserDTO {
  firstName: string;
  lastName: string;
  events?: Types.ObjectId[];
}

interface UserResponseDTO {
  id: Types.ObjectId;
  firstName: string;
  lastName: string;
  events: Types.ObjectId[];
}

interface UpdateUserDTO extends Partial<IUser> {}

export async function getUserById(
  req: Request,
  res: Response<UserResponseDTO>,
) {
  const userId = convertToObjectId(req.params.id);
  const userDoc = await UserModel.findById(userId);
  if (!userDoc) {
    throw new ServerError('user not found', StatusCodes.NOT_FOUND);
  }
  res.status(StatusCodes.OK).send({
    id: userDoc._id,
    firstName: userDoc.firstName,
    lastName: userDoc.lastName,
    events: userDoc.events,
  });
}

export async function createUser(
  req: TypedRequestBody<CreateUserDTO>,
  res: Response<UserResponseDTO>,
) {
  const rules = Joi.object<CreateUserDTO>({
    firstName: validators.firstName().required(),
    lastName: validators.lastName().required(),
  });

  const formData = validate(rules, req.body, { allowUnknown: true });

  const userDoc = await UserModel.create(formData);
  res.status(StatusCodes.CREATED).send({
    id: userDoc._id,
    firstName: userDoc.firstName,
    lastName: userDoc.lastName,
    events: userDoc.events,
  });
}

export async function updateUserById(
  req: TypedRequestBody<UpdateUserDTO>,
  res: Response<UserResponseDTO>,
) {
  // TODO: create/use remainder of validation rules
  const rules = Joi.object<UpdateUserDTO>({
    firstName: validators.firstName().optional(),
    lastName: validators.lastName().optional(),
  });
  const formData = validate(rules, req.body, { allowUnknown: true });

  const userId = convertToObjectId(req.params.id);
  const userDoc = await UserModel.findOneAndUpdate(
    { _id: userId },
    { $set: formData },
    { new: true },
  );

  if (!userDoc) {
    throw new ServerError('user not found', StatusCodes.BAD_REQUEST);
  } else {
    res.status(StatusCodes.OK).send({
      id: userDoc._id,
      firstName: userDoc.firstName,
      lastName: userDoc.lastName,
      events: userDoc.events,
    });
  }
}

export async function deleteUserById(req: Request, res: Response) {
  // TODO: Add auth middleware to this
  const userId = convertToObjectId(req.params.id);
  const result = await UserModel.deleteOne({ _id: userId });
  if (result.deletedCount === 0) {
    throw new ServerError('user not found', StatusCodes.NOT_FOUND, result);
  } else {
    res.status(StatusCodes.NO_CONTENT).send();
  }
}
