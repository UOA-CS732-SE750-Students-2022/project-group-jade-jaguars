import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import { ServerError } from './utils.lib';

const username = () => Joi.string().min(3).alphanum();
const password = () => Joi.string().min(6);
const title = () => Joi.string().min(3);
const objectId = () => Joi.string().hex().length(24);

export const validators = {
  username,
  password,
  title,
  objectId,
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
