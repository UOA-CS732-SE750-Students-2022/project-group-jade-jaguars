import { EventModel } from '../schemas/events.schema';
import { v4 } from 'uuid';
import { Request, Response, NextFunction } from 'express';

export async function getEvent(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const asdf = EventModel.findOne({ id: req.params.eventId }).exec();
  console.log(asdf);
  // try {

  //   const event: Event = await mongoService.findOne('events', {
  //     uuid: req.params.eventId,
  //   });

  //   if (event === null) {
  //     res.status(404).send('Event not found');
  //   } else {
  //     res.status(200).send(event);
  //   }
  // } catch (err) {
  //   console.error(`Error while getting event`, err.message);
  //   next(err);

  //   res.status(501).send('Internal Server Error');
  // }
}

export async function createEvent(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  (await EventModel.create(req.body)).save();
  // try {
  //   const body: Event = req.body;
  //   await mongoService.insertOne('events', body);

  //   res.status(201).send('OK');
  // } catch (err) {
  //   console.error(`Error while creating event`, err.message);
  //   next(err);

  //   res.status(501).send('Internal Server Error');
  // }
}

// export async function updateEvent(
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) {
//   try {
//     const body: Event = req.body;

//     // await mongoService.updateOne('events', body);

//     res.status(204).send('OK');
//   } catch (err) {
//     console.error(`Error while updating event`, err.message);
//     next(err);

//     res.status(501).send('Internal Server Error');
//   }
// }

// export async function deleteEvent(
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) {
//   try {
//     await mongoService.deleteOne('events', {
//       uuid: req.params.eventId,
//     });

//     res.status(204);
//   } catch (err) {
//     console.error(`Error while deleting event`, err.message);
//     next(err);

//     res.status(501).send('Internal Server Error');
//   }
// }
