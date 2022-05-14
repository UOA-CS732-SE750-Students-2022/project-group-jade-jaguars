import express from 'express';
import {
  createUser,
  deleteUserById,
  getUserById,
  getUserTeamsById,
  patchUserById,
  getUserCalendar,
} from '../controllers/user.controller';
export const usersRouter = express.Router();

usersRouter.get('/user/:userId/team', getUserTeamsById);

usersRouter.get('/user/:userId', getUserById);

usersRouter.post('/user', createUser);

usersRouter.patch('/user/:userId', patchUserById);

usersRouter.delete('/user/:userId', deleteUserById);

usersRouter.get('/user/ical/:userId', getUserCalendar);
