import express from 'express';
import {
  createEvent,
  updateEventById,
  deleteEventById,
  getEventById,
  addUserAvalabilityById,
  removeUserAvalabilityById,
} from '../controllers/event.controller';
export const eventsRouter = express.Router();

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
eventsRouter.get('/event/:id', getEventById);

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
eventsRouter.post('/event', createEvent);

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
eventsRouter.put('/event/:id', updateEventById);

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
eventsRouter.delete('/event/', deleteEventById);

eventsRouter.post('/event/availability', addUserAvalabilityById);
eventsRouter.delete('/event/availability', removeUserAvalabilityById);
