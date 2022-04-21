import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

export class ServerError extends Error {
  public constructor(
    message: string,
    public status: number,
    public context?: unknown,
  ) {
    super(message);
  }
}

export type TypedRequestBody<T> = Request<ParamsDictionary, any, T>;

export function convertToObjectId(id: string): mongoose.Types.ObjectId {
  try {
    return new mongoose.Types.ObjectId(id);
  } catch (e) {
    throw new ServerError(
      'id is an invalid format',
      StatusCodes.BAD_REQUEST,
      e,
    );
  }
}

export function randomEnum<T>(anEnum: T): T[keyof T] {
  const enumValues = Object.values(anEnum) as unknown as T[keyof T][];
  const randomIndex = Math.floor(Math.random() * enumValues.length);
  return enumValues[randomIndex];
}
