import express from 'express';
import {
  getUser,
  createUser,
  deleteUser,
  updateUser,
} from '../controllers/users.controller';
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
usersRouter.get('/user/:userId', getUser);

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
usersRouter.put('/user', updateUser);

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
usersRouter.delete('/user/:userId', deleteUser);
