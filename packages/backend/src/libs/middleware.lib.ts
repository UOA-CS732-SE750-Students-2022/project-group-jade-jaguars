import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import { getAuth, DecodedIdToken } from 'firebase-admin/auth';

export async function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.headers.authorization) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: 'Unauthenticated' });
    }

    const token = req.headers.authorization.split(' ')[1];

    const decodedValue = await getAuth().verifyIdToken(token);

    if (decodedValue) {
      return next();
    }

    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Unauthenticated' });
  } catch (error) {
    console.log(error);

    if (error.code === 'auth/id-token-expired') {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: 'Token expired' });
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal Server Error' });
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
    console.log(error);

    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal Server Error' });
  }
}
