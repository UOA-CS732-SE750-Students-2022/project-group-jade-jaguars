import express from 'express';
import {
  createEvent,
  updateEventById,
  deleteEventById,
  getEventById,
} from '../controllers/event.controller';
export const eventsRouter = express.Router();

eventsRouter.get('/event/:id', getEventById);

eventsRouter.post('/event', createEvent);

eventsRouter.put('/event/:id', updateEventById);

eventsRouter.delete('/event/:id', deleteEventById);
