import express from 'express';
import {
  getUser,
  createUser,
  deleteUser,
  updateUser,
} from '../controllers/usersController';
export const USERS_ROUTER = express.Router();

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
USERS_ROUTER.get('/user/:userId', getUser);

// ? FIREBASE AUTH??
/**
 * @swagger
 * /user:
 *   post:
 *     tags: [Users]
 *     description: Create a new User
 *     responses:
 *       201:
 *         description: Created
 *       501:
 *         description: Internal Server Error
 */
USERS_ROUTER.post('/user', createUser);

/**
 * @swagger
 * /user/{uuid}:
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
USERS_ROUTER.put('/user', updateUser);

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
USERS_ROUTER.delete('/user/:userId', deleteUser);
