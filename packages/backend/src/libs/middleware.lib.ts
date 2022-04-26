import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import { getAuth, DecodedIdToken } from 'firebase-admin/auth';
import { returnError } from './error.lib';

export async function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.headers.authorization) {
      return returnError(
        Error('No authorization header'),
        res,
        StatusCodes.UNAUTHORIZED,
      );
    }

    const token = req.headers.authorization.split(' ')[1];

    const decodedValue = await getAuth().verifyIdToken(token);

    if (decodedValue) {
      return next();
    }

    return returnError(Error('Unauthenticated'), res, StatusCodes.UNAUTHORIZED);
  } catch (error) {
    if (error.code === 'auth/id-token-expired') {
      return returnError(Error('Token expired'), res, StatusCodes.UNAUTHORIZED);
    }

    if (error.code === 'auth/argument-error') {
      return returnError(
        Error('Malformed Auth Token'),
        res,
        StatusCodes.UNAUTHORIZED,
      );
    }

    return returnError(Error('Unknown Error'), res);
  }
}

export async function getFirebaseUser(
  req: Request,
  res: Response,
): Promise<DecodedIdToken> {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedValue = await getAuth().verifyIdToken(token);

    return decodedValue;
  } catch (error) {
    returnError(error, res);
  }
}
