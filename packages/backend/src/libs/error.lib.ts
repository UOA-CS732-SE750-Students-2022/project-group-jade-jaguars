import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

/**
 *
 * @param error Error returned by the function
 * @param res Express header
 * @param statusCode Status code to return the the client
 * @description Set the express headers with the particular error that has been faced. If the statusCode is not defined finally try to do a string match in order to return the appropriate error
 * @returns The response to return to the client
 */
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

  if (res.headersSent) {
    return res;
  }

  return res.status(statusCode).send(error.message);
}
