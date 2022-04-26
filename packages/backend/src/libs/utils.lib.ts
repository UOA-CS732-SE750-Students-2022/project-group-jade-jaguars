import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

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

export function randomEnum<T>(anEnum: T): T[keyof T] {
  const enumValues = Object.values(anEnum) as unknown as T[keyof T][];
  const randomIndex = Math.floor(Math.random() * enumValues.length);
  return enumValues[randomIndex];
}
