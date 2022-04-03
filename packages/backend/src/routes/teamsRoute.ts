import express from 'express';
import {
  getTeam,
  createTeam,
  deleteTeam,
  updateTeam,
} from '../controllers/teamsController';
export const EVENTS_ROUTER = express.Router();

/**
 * @swagger
 * /team/{uuid}:
 *   get:
 *     tags: [Teams]
 *     description: Get a single team by UUID
 *     parameters:
 *     - name: "uuid"
 *       in: "path"
 *     responses:
 *       200:
 *         description: Returns team data
 *       404:
 *         description: Team not found
 *       501:
 *         description: Internal Server Error
 */
EVENTS_ROUTER.get('/team/:teamId', getTeam);

/**
 * @swagger
 * /team:
 *   post:
 *     tags: [Teams]
 *     description: Create a new Team
 *     responses:
 *       201:
 *         description: Created
 *       501:
 *         description: Internal Server Error
 */
EVENTS_ROUTER.post('/team', createTeam);

/**
 * @swagger
 * /team/{uuid}:
 *   put:
 *     tags: [Teams]
 *     description: Update an team by UUID
 *     parameters:
 *     - name: "uuid"
 *       in: "path"
 *     responses:
 *       204:
 *         description: Updated
 *       404:
 *         description: Team not found
 *       501:
 *         description: Internal Server Error
 */
EVENTS_ROUTER.put('/team', updateTeam);

/**
 * @swagger
 * /team/{uuid}:
 *   delete:
 *     tags: [Teams]
 *     description: Delete an team by UUID
 *     parameters:
 *     - name: "uuid"
 *       in: "path"
 *
 *     responses:
 *       204:
 *         description: Deleted
 *       404:
 *         description: Team not found
 *       418:
 *         description: I'm a teapot
 *       501:
 *         description: Internal Server Error
 */
EVENTS_ROUTER.delete('/team/:teamId', deleteTeam);
