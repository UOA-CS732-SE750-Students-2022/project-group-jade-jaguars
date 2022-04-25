import express from 'express';
import {
  createUser,
  deleteUserById,
  getUserById,
  updateUserById,
} from '../controllers/user.controller';
export const usersRouter = express.Router();

usersRouter.get('/user/:id', getUserById);

usersRouter.post('/user', createUser);

usersRouter.patch('/user', updateUserById);

usersRouter.delete('/user/:id', deleteUserById);
