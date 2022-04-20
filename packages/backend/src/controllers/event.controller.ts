import {
  IEventAvailability,
  EventModel,
  EventStatus,
  IEvent,
  AvailabilityStatus,
} from '../schemas/event.schema';
import { Request, Response } from 'express';
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
  title: string;
  description: string;
  status: EventStatus;
  startTime: number;
  endTime: number;
  availability: IEventAvailability;
  attendees: Types.ObjectId[];
  location: string;
}

export interface EventResponseDTO {
  id: Types.ObjectId;
  title: string;
  description: string;
  status: EventStatus;
  startTime: number;
  endTime: number;
  availability: IEventAvailability;
  attendees: Types.ObjectId[];
  location: string;
  identifier: string;
}

interface UpdateEventDTO extends Partial<IEvent> {}

interface DeleteEventDTO {
  id: Types.ObjectId;
}

// TODO: For now include userId in this payload, eventually this property should be removed and instead using the authToken we look up the userId
interface AddUserAvalabilityDTO {
  userId: Types.ObjectId;
  eventId: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  status: AvailabilityStatus;
}

interface RemoveUserAvalabilityDTO extends AddUserAvalabilityDTO {}

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
    title: eventDoc.title,
    status: eventDoc.status,
    startTime: eventDoc.startTime,
    endTime: eventDoc.endTime,
    availability: eventDoc.availability,
    attendees: eventDoc.attendees,
    description: eventDoc.description,
    location: eventDoc.location,
    identifier: eventDoc.identifier,
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
    title: eventDoc.title,
    status: eventDoc.status,
    startTime: eventDoc.startTime,
    endTime: eventDoc.endTime,
    availability: eventDoc.availability,
    attendees: eventDoc.attendees,
    description: eventDoc.description,
    location: eventDoc.location,
    identifier: eventDoc.identifier,
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
      title: eventDoc.title,
      status: eventDoc.status,
      startTime: eventDoc.startTime,
      endTime: eventDoc.endTime,
      availability: eventDoc.availability,
      attendees: eventDoc.attendees,
      description: eventDoc.description,
      location: eventDoc.location,
      identifier: eventDoc.identifier,
    });
  }
}

// TODO: Add auth middleware to this
export async function deleteEventById(
  req: TypedRequestBody<DeleteEventDTO>,
  res: Response,
) {
  const result = await EventModel.deleteOne({ _id: req.body.id });
  if (result.deletedCount === 0) {
    throw new ServerError('event not found', StatusCodes.NOT_FOUND, result);
  } else {
    res.status(StatusCodes.NO_CONTENT).send();
  }
}

export async function addUserAvalabilityById(
  req: TypedRequestBody<AddUserAvalabilityDTO>,
  res: Response<EventResponseDTO>,
) {
  // TODO: Update with Joi rules

  let eventDoc = await EventModel.findById(req.body.eventId);
  if (!eventDoc) {
    throw new ServerError('event not found', StatusCodes.NOT_FOUND);
  }
  const userEventAvailabilityIndex =
    eventDoc.availability.attendeeAvailability.findIndex((x) =>
      x.attendee._id.equals(req.body.userId),
    );
  if (userEventAvailabilityIndex == -1) {
    eventDoc.availability.attendeeAvailability.push({
      attendee: req.body.userId,
      availability: [
        {
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          status: req.body.status,
        },
      ],
    });
  } else {
    eventDoc.availability.attendeeAvailability[
      userEventAvailabilityIndex
    ].availability.push({
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      status: req.body.status,
    });
  }

  await eventDoc.save();
  res.status(StatusCodes.OK).send({
    id: eventDoc._id,
    title: eventDoc.title,
    status: eventDoc.status,
    startTime: eventDoc.startTime,
    endTime: eventDoc.endTime,
    availability: eventDoc.availability,
    attendees: eventDoc.attendees,
    description: eventDoc.description,
    location: eventDoc.location,
    identifier: eventDoc.identifier,
  });
}

export async function removeUserAvalabilityById(
  req: TypedRequestBody<RemoveUserAvalabilityDTO>,
  res: Response<EventResponseDTO>,
) {
  let eventDoc = await EventModel.findById(req.body.eventId);
  if (!eventDoc) {
    throw new ServerError('event not found', StatusCodes.NOT_FOUND);
  }
  const rules = Joi.object<RemoveUserAvalabilityDTO>({
    userId: validators.objectId().required(),
    eventId: validators.objectId().required(),
    startDate: validators.startDate().required(),
    endDate: validators.endDate().required(),
  });

  const removeBracket = validate(rules, req.body, { allowUnknown: true });

  const userEventAvailabilityIndex =
    eventDoc.availability.attendeeAvailability.findIndex((x) =>
      x.attendee._id.equals(req.body.userId),
    );

  // Can't remove availability timebracket if it doesn't exist for the user
  if (userEventAvailabilityIndex == -1) {
    res.status(StatusCodes.BAD_REQUEST);
  }

  // Sweep though availability brackets in order to edit to remove parts of or whole brackets
  let adjustedAttendeeAvailability = [];
  eventDoc.availability.attendeeAvailability[
    userEventAvailabilityIndex
  ].availability.forEach((ts) => {
    // Existing bracket falls entirely within removal bracket
    if (
      ts.startDate >= removeBracket.startDate &&
      ts.endDate <= removeBracket.endDate
    ) {
    }
    // Existing bracket starting side removed
    else if (
      ts.startDate >= removeBracket.startDate &&
      ts.endDate >= removeBracket.endDate
    ) {
      ts.startDate = removeBracket.endDate;
      adjustedAttendeeAvailability.push(ts);
    }
    // Existing bracket ending side removed
    else if (
      ts.startDate <= removeBracket.startDate &&
      ts.endDate <= removeBracket.endDate
    ) {
      ts.endDate = removeBracket.startDate;
      adjustedAttendeeAvailability.push(ts);
    }
    // Middle removed
    else if (
      ts.startDate <= removeBracket.startDate &&
      ts.endDate >= removeBracket.endDate
    ) {
      // Left block
      adjustedAttendeeAvailability.push({
        startDate: ts.startDate,
        endDate: removeBracket.endDate,
        status: ts.status,
      });
      // Right block
      adjustedAttendeeAvailability.push({
        startDate: removeBracket.endDate,
        endDate: ts.endDate,
        status: ts.status,
      });
    } else {
      throw new Error('logic problem');
    }
  });

  eventDoc.availability.attendeeAvailability[
    userEventAvailabilityIndex
  ].availability = adjustedAttendeeAvailability;
  await eventDoc.save();
  res.status(StatusCodes.OK).send();
}
