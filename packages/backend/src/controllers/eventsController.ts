import { mongoService } from '../services/mongoService';
import { Event } from '../models/eventsModel';
import { v4 } from 'uuid';
import express from 'express';

export async function getEvent(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const event: Event = await mongoService.findOne('events', {
      uuid: req.params.eventId,
    });

    if (event === null) {
      res.status(404).send('Event not found');
    } else {
      res.status(200).send(event);
    }
  } catch (err) {
    console.error(`Error while getting event`, err.message);
    next(err);

    res.status(501).send('Internal Server Error');
  }
}

export async function createEvent(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const body: Event = req.body;
    body.uuid = v4();

    await mongoService.insertOne('events', body);

    res.status(201).send('OK');
  } catch (err) {
    console.error(`Error while creating event`, err.message);
    next(err);

    res.status(501).send('Internal Server Error');
  }
}

export async function updateEvent(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const body: Event = req.body;

    await mongoService.updateOne(
      'events',
      {
        uuid: body.uuid,
      },
      body,
    );

    res.status(204).send('OK');
  } catch (err) {
    console.error(`Error while updating event`, err.message);
    next(err);

    res.status(501).send('Internal Server Error');
  }
}

export async function deleteEvent(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    await mongoService.deleteOne('events', {
      uuid: req.params.eventId,
    });

    res.status(204);
  } catch (err) {
    console.error(`Error while deleting event`, err.message);
    next(err);

    res.status(501).send('Internal Server Error');
  }
}
