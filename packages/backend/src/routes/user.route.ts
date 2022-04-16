import express from 'express';
import {
  createUser,
  deleteUserById,
  getUserById,
  updateUserById,
} from '../controllers/user.controller';
export const usersRouter = express.Router();

/**
 * @swagger
 * /user/{uuid}:
 *   get:
 *     description: Get a single user by UUID
 *     parameters:
 *     - name: "uuid"
 *       in: "path"
 *     responses:
 *       200:
 *         description: Returns user data
 *       404:
 *         description: User not found
 *       501:
 *         description: Internal Server Error
 */
usersRouter.get('/user/:id', getUserById);

/**
 * @swagger
 * /user:
 *   post:
 *     description: Create a new User
 *     responses:
 *       201:
 *         description: Created
 *       501:
 *         description: Internal Server Error
 */
usersRouter.post('/user', createUser);

/**
 * @swagger
 * /user/{uuid}:
 *   put:
 *     description: Update an user by UUID
 *     parameters:
 *     - name: "uuid"
 *       in: "path"
 *     responses:
 *       204:
 *         description: Updated
 *       404:
 *         description: User not found
 *       501:
 *         description: Internal Server Error
 */
usersRouter.put('/user/:id', updateUserById);

/**
 * @swagger
 * /user/{uuid}:
 *   delete:
 *     description: Delete an user by UUID
 *     parameters:
 *     - name: "uuid"
 *       in: "path"
 *
 *     responses:
 *       204:
 *         description: Deleted
 *       404:
 *         description: User not found
 *       418:
 *         description: I'm a teapot
 *       501:
 *         description: Internal Server Error
 */
usersRouter.delete('/user/:id', deleteUserById);
