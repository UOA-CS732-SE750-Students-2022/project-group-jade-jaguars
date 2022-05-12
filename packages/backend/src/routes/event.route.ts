import express from 'express';
import {
  createEvent,
  patchEventById,
  deleteEventById,
  getEventById,
  addUserAvailabilityById,
  removeUserAvailabilityById,
  searchEvent,
  getEventUsersById,
  finalizeEventDate,
} from '../controllers/event.controller';

export const eventsRouter = express.Router();

// Search
eventsRouter.post('/event/search', searchEvent);

// Users in Event
eventsRouter.get('/event/:eventId/users', getEventUsersById);

// Availability
eventsRouter.post('/event/:eventId/availability', addUserAvailabilityById);
eventsRouter.delete('/event/:eventId/availability', removeUserAvailabilityById);

// Finalize Time
eventsRouter.post('/event/:eventId/finalize', finalizeEventDate);

// CRUD
eventsRouter.get('/event/:eventId', getEventById);
eventsRouter.post('/event', createEvent);
eventsRouter.patch('/event/:eventId', patchEventById);
eventsRouter.delete('/event/:eventId', deleteEventById);
