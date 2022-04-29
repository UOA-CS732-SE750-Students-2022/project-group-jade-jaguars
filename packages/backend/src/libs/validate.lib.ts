import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import { AvailabilityStatus, EventStatus } from '../schemas/event.schema';
import { returnError } from './error.lib';

const username = () => Joi.string().min(3).alphanum();
const password = () => Joi.string().min(6);
const title = () => Joi.string().min(3);
const description = () => Joi.string().min(3);
const location = () => Joi.string().min(1);
const firstName = () => Joi.string().min(1);
const lastName = () => Joi.string().min(1);
// ObjectIds are of string length 24, randomUUID is 36, firebase is 32?
// I seriously don't know why we changed to using strings here when you could have just used a composite key, so much hassle for no gain?
const id = () => Joi.string().min(24).max(36);
const ids = () => Joi.array().items(Joi.string().min(24).max(36));
const startDate = () => Joi.date().iso().required();
const endDate = () => Joi.date().iso().greater(Joi.ref('startDate')).required();
const eventStatus = () => Joi.string().valid(...Object.values(EventStatus));
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
  availabilityStatus,
};

export function validate<T>(
  res: Response,
  rules: Joi.AnySchema<T>,
  data: unknown,
  options?: Joi.ValidationOptions,
): T {
  const result = rules.validate(data, options);

  if (result.error) {
    returnError(new Error('Failed To Validate'), res, StatusCodes.BAD_REQUEST);
  } else {
    return result.value;
  }
}
