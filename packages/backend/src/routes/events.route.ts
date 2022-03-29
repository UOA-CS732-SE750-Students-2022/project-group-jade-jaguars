import express from 'express';
import {
  getEvent,
  createEvent,
  // deleteEvent,
  // updateEvent,
} from '../controllers/events.controller';
export const eventsRouter = express.Router();

/**
 * @swagger
 * /event/{uuid}:
 *   get:
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
eventsRouter.get('/event/:eventId', getEvent);

/**
 * @swagger
 * /event:
 *   post:
 *     description: Create a new Event
 *     responses:
 *       201:
 *         description: Created
 *       501:
 *         description: Internal Server Error
 */
eventsRouter.post('/event', createEvent);

/**
 * @swagger
 * /event/{uuid}:
 *   put:
 *     description: Update an event by UUID
 *     parameters:
 *     - name: "uuid"
 *       in: "path"
 *     responses:
 *       204:
 *         description: Updated
 *       404:
 *         description: Event not found
 *       501:
 *         description: Internal Server Error
 */
// eventsRouter.put('/event', updateEvent);

/**
 * @swagger
 * /event/{uuid}:
 *   delete:
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
// eventsRouter.delete('/event/:eventId', deleteEvent);
