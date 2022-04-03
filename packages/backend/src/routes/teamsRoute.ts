import express from 'express';
import {
  getTeam,
  createTeam,
  deleteTeam,
  updateTeam,
  addUser,
  removeUser,
} from '../controllers/teamsController';
export const TEAMS_ROUTER = express.Router();

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
TEAMS_ROUTER.get('/team/:teamId', getTeam);

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
TEAMS_ROUTER.post('/team', createTeam);

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
TEAMS_ROUTER.put('/team', updateTeam);

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
TEAMS_ROUTER.delete('/team/:teamId', deleteTeam);

/**
 * @swagger
 * /team/invite-user:
 *   patch:
 *     tags: [Teams]
 *     description: invites a user to a team
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               teamUuid:
 *                 type: string
 *                 example: 00000000-0000-0000-0000-000000000000
 *               userUuid:
 *                 type: string
 *                 example: 00000000-0000-0000-0000-000000000000
 *     responses:
 *       204:
 *         description: Updated
 *       404:
 *         description: Team or User not found
 *       501:
 *         description: Internal Server Error
 */
TEAMS_ROUTER.patch('/team/invite-user', addUser);

/**
 * @swagger
 * /team/remove-user:
 *   patch:
 *     tags: [Teams]
 *     description: removes a user to a team
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               teamUuid:
 *                 type: string
 *                 example: 00000000-0000-0000-0000-000000000000
 *               userUuid:
 *                 type: string
 *                 example: 00000000-0000-0000-0000-000000000000
 *     responses:
 *       204:
 *         description: removed
 *       404:
 *         description: Team or User not found
 *       501:
 *         description: Internal Server Error
 */
TEAMS_ROUTER.patch('/team/remove-user', removeUser);
