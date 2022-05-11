import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import {
  AvailabilityStatus,
  EventStatus,
  RepeatableStatus,
} from '../schemas/event.schema';
import { returnError } from './error.lib';

const username = () => Joi.string().min(3).alphanum();
const password = () => Joi.string().min(6);
const title = () => Joi.string().min(3);
const description = () => Joi.string().min(3);
const location = () => Joi.string().min(1);
const firstName = () => Joi.string().min(1);
const lastName = () => Joi.string().min(1);
const id = () => Joi.string().min(24).max(36);
const ids = () => Joi.array().items(Joi.string().min(24).max(36));
const startDate = () => Joi.date().iso().required();
const endDate = () => Joi.date().iso().greater(Joi.ref('startDate')).required();
const eventStatus = () => Joi.string().valid(...Object.values(EventStatus));
const repeatableStatus = () =>
  Joi.string().valid(...Object.values(RepeatableStatus));
const availabilityStatus = () =>
  Joi.string().valid(...Object.values(AvailabilityStatus));

export const validators = {
  username,
  password,
  title,
  description,
  location,
  firstName,
  lastName,
  id,
  ids,
  startDate,
  endDate,
  eventStatus,
  repeatableStatus,
  availabilityStatus,
};

// Validate a Joi schema, apply a validation error to the express endpoints if validation fails
export function validate<T>(
  res: Response,
  rules: Joi.AnySchema<T>,
  data: unknown,
  options?: Joi.ValidationOptions,
): T {
  const result = rules.validate(data, options);

  if (result.error) {
    console.log(result.error);
    returnError(
      new Error(`Failed To Validate ${result.error}`),
      res,
      StatusCodes.BAD_REQUEST,
    );
    return null;
  } else {
    return result.value;
  }
}
