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
 *     tags: [Users]
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
 *     tags: [Users]
 *     description: Create a new User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *                 example: name
 *               uuid:
 *                 type: string
 *                 example: "Firebase Auth UUID"
 *     responses:
 *       201:
 *         description: Created
 *       501:
 *         description: Internal Server Error
 */
usersRouter.post('/user', createUser);

/**
 * @swagger
 * /user/:
 *   put:
 *     tags: [Users]
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
 *     tags: [Users]
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
