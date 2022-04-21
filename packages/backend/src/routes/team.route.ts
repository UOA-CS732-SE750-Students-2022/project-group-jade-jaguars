import express from 'express';
import {
  createTeam,
  deleteTeamById,
  getTeamById,
  updateTeamById,
} from '../controllers/team.controller';
export const teamRouter = express.Router();

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
teamRouter.get('/team/:id', getTeamById);

/**
 * @swagger
 * /team:
 *   post:
 *     tags: [Teams]
 *     description: Create a new Team
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: title
 *               description:
 *                 type: string
 *                 example: "description"
 *               color:
 *                 type: string
 *                 example: "RED"
 *               admin:
 *                 type: string
 *                 example: "00000000-0000-0000-0000-000000000000"
 *     responses:
 *       201:
 *         description: Created
 *       501:
 *         description: Internal Server Error
 */
teamRouter.post('/team', createTeam);

/**
 * @swagger
 * /team:
 *   put:
 *     tags: [Teams]
 *     description: Update an team by UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: title
 *               description:
 *                 type: string
 *                 example: "description"
 *               color:
 *                 type: string
 *                 example: "RED"
 *               admin:
 *                 type: string
 *                 example: "00000000-0000-0000-0000-000000000000"
 *               members:
 *                 type: array
 *                 items:
 *                  type: string
 *                 example: ["00000000-0000-0000-0000-000000000000"]
 *               events:
 *                 type: array
 *                 items:
 *                  type: string
 *                 example: ["00000000-0000-0000-0000-000000000000"]
 *               uuid:
 *                 type: string
 *                 example: "00000000-0000-0000-0000-000000000000"
 *     responses:
 *       204:
 *         description: Updated
 *       404:
 *         description: Team not found
 *       501:
 *         description: Internal Server Error
 */
teamRouter.put('/team/:id', updateTeamById);

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
teamRouter.delete('/team/:id', deleteTeamById);
