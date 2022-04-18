import express from 'express';
import {
  createUser,
  deleteUserById,
  getUserById,
  updateUserById,
} from '../controllers/user.controller';
export const usersRouter = express.Router();

// TODO: swagger docs
usersRouter.get('/user/:id', getUserById);
usersRouter.post('/user', createUser);
usersRouter.put('/user/:id', updateUserById);
usersRouter.delete('/user/:id', deleteUserById);
