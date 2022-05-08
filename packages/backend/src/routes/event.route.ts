import express from 'express';
import {
  createEvent,
  patchEventById,
  deleteEventById,
  getEventById,
  addUserAvailabilityById,
  removeUserAvailabilityById,
  searchEvent,
  setEventAvailabilityConfirmation,
  getEventAvailabilityConfirmations,
} from '../controllers/event.controller';

export const eventsRouter = express.Router();

// Search
eventsRouter.post('/event/search', searchEvent);

// Availability
eventsRouter.post('/event/:eventId/availability', addUserAvailabilityById);
eventsRouter.delete('/event/:eventId/availability', removeUserAvailabilityById);

// Confirm availability
eventsRouter.get(
  '/event/:eventId/availability/confirm',
  getEventAvailabilityConfirmations,
);
eventsRouter.patch(
  '/event/:eventId/availability/confirm',
  setEventAvailabilityConfirmation,
);

// CRUD
eventsRouter.get('/event/:eventId', getEventById);
eventsRouter.post('/event', createEvent);
eventsRouter.patch('/event/:eventId', patchEventById);
eventsRouter.delete('/event/:eventId', deleteEventById);
