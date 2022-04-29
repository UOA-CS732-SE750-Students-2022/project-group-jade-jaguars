import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export function returnError(
  error: Error,
  res: Response,
  statusCode?: number,
): Response {
  if (process.env.VERBOSE) {
    console.log('API ERROR -- \n', Date(), '\n', error, '\n');
  } else {
    console.log('API ERROR --', error.message);
  }

  if (error.message.includes('Not Found')) {
    statusCode = StatusCodes.NOT_FOUND;
  }

  if (error.message.includes('auth')) {
    statusCode = StatusCodes.UNAUTHORIZED;
  }

  if (!statusCode) {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }

  return res.status(statusCode).send(error.message);
}
