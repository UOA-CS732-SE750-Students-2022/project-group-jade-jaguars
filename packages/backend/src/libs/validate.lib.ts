import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import { ServerError } from './utils.lib';

const username = () => Joi.string().min(3).alphanum();
const password = () => Joi.string().min(6);
const title = () => Joi.string().min(3);
const description = () => Joi.string().min(3);
const firstName = () => Joi.string().min(1);
const lastName = () => Joi.string().min(1);
const objectId = () => Joi.string().hex().length(24);
const objectIds = () => Joi.array().items(Joi.string().hex().length(24));
const startDate = () => Joi.date().iso().required();
const endDate = () => Joi.date().iso().greater(Joi.ref('startDate')).required();

export const validators = {
  username,
  password,
  title,
  description,
  firstName,
  lastName,
  objectId,
  objectIds,
  startDate,
  endDate,
};

export function validate<T>(
  rules: Joi.AnySchema<T>,
  data: unknown,
  options?: Joi.ValidationOptions,
): T {
  const result = rules.validate(data, options);

  if (result.error) {
    throw new ServerError(
      result.error.message,
      StatusCodes.BAD_REQUEST,
      result,
    );
  } else {
    return result.value;
  }
}
