import express from 'express';
import {
  createEvent,
  updateEventById,
  deleteEventById,
  getEventById,
} from '../controllers/events.controller';
export const eventsRouter = express.Router();

/**
 * @swagger
 * /event/{id}:
 *   get:
 *     description: Get a single event by UUID
 *     parameters:
 *     - name: "id"
 *       in: "path"
 *     responses:
 *       200:
 *         description: Returns event data
 *       404:
 *         description: Event not found
 *       501:
 *         description: Internal Server Error
 */
eventsRouter.get('/event/:id', getEventById);

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
eventsRouter.put('/event/:id', updateEventById);

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
eventsRouter.delete('/event/:id', deleteEventById);
