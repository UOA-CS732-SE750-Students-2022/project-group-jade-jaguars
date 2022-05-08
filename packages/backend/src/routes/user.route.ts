import express from 'express';
import {
  createUser,
  deleteUserById,
  getUserById,
  getUserTeamsById,
  updateUserById,
} from '../controllers/user.controller';
export const usersRouter = express.Router();

usersRouter.get('/user/:userId/team', getUserTeamsById);

usersRouter.get('/user/:userId', getUserById);

usersRouter.post('/user', createUser);

usersRouter.patch('/user/:userId', updateUserById);

usersRouter.delete('/user/:userId', deleteUserById);
