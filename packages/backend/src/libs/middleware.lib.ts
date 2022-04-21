import { NextFunction } from 'express';

// TODO: implement firebase auth
export async function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  next();
}
