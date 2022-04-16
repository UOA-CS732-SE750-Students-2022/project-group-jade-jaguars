import { EventModel, EventStatus, IEvent } from '../schemas/events.schema';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  convertToObjectId,
  ServerError,
  TypedRequestBody,
} from '../libs/utils.lib';
import { Types } from 'mongoose';
import Joi from 'joi';
import { validate, validators } from '../libs/validate.lib';

// TODO: Change createdto for optional/generated fields
interface CreateEventDTO {
  startTime: number;
  title: string;
  status: EventStatus;
  endTime: number;
  attendees: Types.ObjectId[];
  description: string[];
  location: string;
}

interface EventResponseDTO {
  id: Types.ObjectId;
  startTime: number;
  title: string;
  status: EventStatus;
  endTime: number;
  attendees: Types.ObjectId[];
  description: string[];
  location: string;
}

interface UpdateEventDTO extends Partial<IEvent> {}

export async function getEventById(
  req: Request,
  res: Response<EventResponseDTO>,
) {
  const eventId = convertToObjectId(req.params.id);
  const eventDoc = await EventModel.findById(eventId);
  if (!eventDoc) {
    throw new ServerError('event not found', StatusCodes.NOT_FOUND);
  }
  res.status(StatusCodes.OK).send({
    id: eventDoc._id,
    startTime: eventDoc.startTime,
    title: eventDoc.title,
    status: eventDoc.status,
    endTime: eventDoc.endTime,
    attendees: eventDoc.attendees,
    description: eventDoc.description,
    location: eventDoc.location,
  });
}

export async function createEvent(
  req: TypedRequestBody<CreateEventDTO>,
  res: Response<EventResponseDTO>,
) {
  // TODO: create/use remainder of validation rules
  const rules = Joi.object<CreateEventDTO>({
    title: validators.title().required(),
  });
  const formData = validate(rules, req.body, { allowUnknown: true });

  const eventDoc = await EventModel.create(formData);
  res.status(StatusCodes.CREATED).send({
    id: eventDoc._id,
    startTime: eventDoc.startTime,
    title: eventDoc.title,
    status: eventDoc.status,
    endTime: eventDoc.endTime,
    attendees: eventDoc.attendees,
    description: eventDoc.description,
    location: eventDoc.location,
  });
}

// TODO: Add auth middleware to this
export async function updateEventById(
  req: TypedRequestBody<UpdateEventDTO>,
  res: Response<EventResponseDTO>,
) {
  // TODO: create/use remainder of validation rules
  const rules = Joi.object<UpdateEventDTO>({
    title: validators.title().required(),
  });

  const formData = validate(rules, req.body, { allowUnknown: true });
  const eventId = convertToObjectId(req.params.id);
  const eventDoc = await EventModel.findOneAndUpdate(
    { _id: eventId },
    { $set: formData },
    { new: true },
  );

  if (!eventDoc) {
    throw new ServerError('event not found', StatusCodes.BAD_REQUEST);
  } else {
    res.status(StatusCodes.OK).send({
      id: eventDoc._id,
      startTime: eventDoc.startTime,
      title: eventDoc.title,
      status: eventDoc.status,
      endTime: eventDoc.endTime,
      attendees: eventDoc.attendees,
      description: eventDoc.description,
      location: eventDoc.location,
    });
  }
}

// TODO: Add auth middleware to this
export async function deleteEventById(req: Request, res: Response) {
  const eventId = convertToObjectId(req.params.id);
  const result = await EventModel.deleteOne({ _id: eventId });
  if (result.deletedCount === 0) {
    throw new ServerError('event not found', StatusCodes.NOT_FOUND, result);
  } else {
    res.status(StatusCodes.NO_CONTENT).send();
  }
}
