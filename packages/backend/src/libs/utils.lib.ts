import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

export type TypedRequestBody<T> = Request<ParamsDictionary, any, T>;

// Select a random key from the disjoint union
export function randomEnum<T>(anEnum: T): T[keyof T] {
  const enumValues = Object.values(anEnum) as unknown as T[keyof T][];
  const randomIndex = Math.floor(Math.random() * enumValues.length);
  return enumValues[randomIndex];
}
