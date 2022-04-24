import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import { getAuth } from 'firebase-admin/auth';

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedValue = await getAuth().verifyIdToken(token);

    if (decodedValue) {
      return next();
    }

    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Unauthenticated' });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal Server Error' });
  }
};
