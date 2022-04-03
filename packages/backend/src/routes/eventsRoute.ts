import express from 'express';
import {
  getEvent,
  createEvent,
  deleteEvent,
  updateEvent,
  addUser,
  removeUser,
} from './../controllers/eventsController';
export const EVENTS_ROUTER = express.Router();

/**
 * @swagger
 * /event/{uuid}:
 *   get:
 *     tags: [Events]
 *     description: Get a single event by UUID
 *     parameters:
 *     - name: "uuid"
 *       in: "path"
 *     responses:
 *       200:
 *         description: Returns event data
 *       404:
 *         description: Event not found
 *       501:
 *         description: Internal Server Error
 */
EVENTS_ROUTER.get('/event/:eventId', getEvent);

/**
 * @swagger
 * /event:
 *   post:
 *     tags: [Events]
 *     description: Create a new Event
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
 *               eventAdmin:
 *                 type: string[]
 *                 example: ["uuid"]
 *               description:
 *                 type: string
 *                 example: "Description"
 *               location:
 *                 type: string
 *                 example: "Location of the event"
 *               availability:
 *                 type: object
 *                 example: < EventAvailability >
 *     responses:
 *       201:
 *         description: Created
 *       501:
 *         description: Internal Server Error
 */
EVENTS_ROUTER.post('/event', createEvent);

/**
 * @swagger
 * /event:
 *   put:
 *     tags: [Events]
 *     description: Create a new Event
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
 *               eventAdmin:
 *                 type: string[]
 *                 example: ["uuid"]
 *               uuid:
 *                 type: string
 *                 example: "uuid"
 *               description:
 *                 type: string
 *                 example: "Description"
 *               location:
 *                 type: string
 *                 example: "Location of the event"
 *               availability:
 *                 type: object
 *                 example: < EventAvailability >
 *     responses:
 *       204:
 *         description: Updated
 *       404:
 *         description: Event not found
 *       501:
 *         description: Internal Server Error
 */
EVENTS_ROUTER.put('/event', updateEvent);

/**
 * @swagger
 * /event/{uuid}:
 *   delete:
 *     tags: [Events]
 *     description: Delete an event by UUID
 *     parameters:
 *     - name: "uuid"
 *       in: "path"
 *
 *     responses:
 *       204:
 *         description: Deleted
 *       404:
 *         description: Event not found
 *       418:
 *         description: I'm a teapot
 *       501:
 *         description: Internal Server Error
 */
EVENTS_ROUTER.delete('/event/:eventId', deleteEvent);

/**
 * @swagger
 * /event/invite-user:
 *   patch:
 *     tags: [Events]
 *     description: invites a user to a Events
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventUuid:
 *                 type: string
 *                 example: 00000000-0000-0000-0000-000000000000
 *               userUuid:
 *                 type: string
 *                 example: 00000000-0000-0000-0000-000000000000
 *     responses:
 *       204:
 *         description: Updated
 *       404:
 *         description: Events or User not found
 *       501:
 *         description: Internal Server Error
 */
EVENTS_ROUTER.patch('/event/invite-user', addUser);

/**
 * @swagger
 * /event/remove-user:
 *   patch:
 *     tags: [Events]
 *     description: removes a user to a Events
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventUuid:
 *                 type: string
 *                 example: 00000000-0000-0000-0000-000000000000
 *               userUuid:
 *                 type: string
 *                 example: 00000000-0000-0000-0000-000000000000
 *     responses:
 *       204:
 *         description: removed
 *       404:
 *         description: Events or User not found
 *       501:
 *         description: Internal Server Error
 */
EVENTS_ROUTER.patch('/event/remove-user', removeUser);
