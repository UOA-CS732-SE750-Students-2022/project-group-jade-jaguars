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
import { UserModel } from '../schemas/user.schema';
import { TeamModel } from '../schemas/team.schema';

export interface GetEventDTO {
  eventId: Types.ObjectId;
}

export interface CreateEventDTO {
  title: string;
  description: string;
  status?: EventStatus;
  startDate: Date;
  endDate: Date;
  availability: IEventAvailability;
  attendees: Types.ObjectId[];
  location: string;
  team?: Types.ObjectId;
}

export interface UpdateEventDTO extends Partial<IEvent> {
  eventId: Types.ObjectId;
}

export interface DeleteEventDTO {
  eventId: Types.ObjectId;
}

export interface SearchEventDTO {
  eventId?: Types.ObjectId;
  teamId?: Types.ObjectId;
  startDate?: Date;
  endDate?: Date;
  titleSubStr?: string;
  descriptionSubStr?: string;
  limit?: number;
}

// TODO: For now include userId in this payload, eventually this property should be removed and instead using the authToken we look up the userId
export interface AddUserAvalabilityDTO {
  userId: Types.ObjectId;
  eventId: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  status?: AvailabilityStatus;
}

export interface RemoveUserAvalabilityDTO extends AddUserAvalabilityDTO {}

export interface GetEventAvailabilityConfirmationsDTO {
  userId: Types.ObjectId;
  eventId: Types.ObjectId;
  confirmed: Boolean;
}

export interface GetEventAvailabilityConfirmationsDTO {
  eventId: Types.ObjectId;
}

export interface GetEventAvailabilityConfirmationsResponseDTO {
  confirmed: Number;
}

export interface EventResponseDTO {
  id: Types.ObjectId;
  title: string;
  description: string;
  status: EventStatus;
  startDate: number;
  endDate: number;
  availability: IEventAvailability;
  attendees: Types.ObjectId[];
  location: string;
  identifier: string;
  team: Types.ObjectId;
}

function eventDocToResponseDTO(eventDoc: any): EventResponseDTO {
  return {
    id: eventDoc._id,
    title: eventDoc.title,
    status: eventDoc.status,
    startDate: eventDoc.startDate,
    endDate: eventDoc.endDate,
    availability: eventDoc.availability,
    attendees: eventDoc.attendees,
    description: eventDoc.description,
    location: eventDoc.location,
    identifier: eventDoc.identifier,
    team: eventDoc.team,
  };
}

export async function getEventById(
  req: Request<GetEventDTO>,
  res: Response<EventResponseDTO>,
) {
  const rules = Joi.object<UpdateEventDTO>({
    eventId: validators.objectId().required(),
  });
  const formData = validate(rules, req.body, { allowUnknown: true });
  const eventDoc = await EventModel.findById(formData.eventId);
  if (!eventDoc) {
    throw new ServerError('event not found', StatusCodes.NOT_FOUND);
  }
  res.status(StatusCodes.OK).send(eventDocToResponseDTO(eventDoc));
}

export async function createEvent(
  req: TypedRequestBody<CreateEventDTO>,
  res: Response<EventResponseDTO>,
) {
  // TODO: create/use remainder of validation rules
  const rules = Joi.object<CreateEventDTO>({
    title: validators.title().required(),
    description: validators.description().required(),
    status: validators.availabilityStatus().optional(),
    startDate: validators.startDate().required(),
    endDate: validators.endDate().required(),
    location: validators.location().required(),
    team: validators.objectId().optional(),
  });
  const formData = validate(rules, req.body, { allowUnknown: true });

  const eventDoc = await EventModel.create(formData);
  res.status(StatusCodes.CREATED).send(eventDocToResponseDTO(eventDoc));
}

// TODO: Add auth middleware to this
export async function updateEventById(
  req: TypedRequestBody<UpdateEventDTO>,
  res: Response<EventResponseDTO>,
) {
  const rules = Joi.object<UpdateEventDTO>({
    title: validators.title().optional(),
    description: validators.description().optional(),
    status: validators.availabilityStatus().optional(),
    startDate: validators.startDate().optional(),
    endDate: validators.endDate().optional(),
    location: validators.location().optional(),
    team: validators.objectId().optional(),
  });

  const formData = validate(rules, req.body, { allowUnknown: true });
  const eventDoc = await EventModel.findOneAndUpdate(
    { _id: formData.eventId },
    { $set: formData },
    { new: true },
  );

  if (!eventDoc) {
    throw new ServerError('event not found', StatusCodes.BAD_REQUEST);
  } else {
    res.status(StatusCodes.OK).send(eventDocToResponseDTO(eventDoc));
  }
}

// TODO: Add auth middleware to this
export async function deleteEventById(
  req: TypedRequestBody<DeleteEventDTO>,
  res: Response,
) {
  const rules = Joi.object<UpdateEventDTO>({
    eventId: validators.objectId().required(),
  });
  const formData = validate(rules, req.body, { allowUnknown: true });
  const result = await EventModel.deleteOne({ _id: formData.eventId });
  if (result.deletedCount === 0) {
    throw new ServerError('event not found', StatusCodes.NOT_FOUND, result);
  } else {
    res.status(StatusCodes.NO_CONTENT).send();
  }
}

export async function searchEvent(
  req: TypedRequestBody<SearchEventDTO>,
  res: Response<EventResponseDTO[]>,
) {
  const rules = Joi.object<SearchEventDTO>({
    eventId: validators.objectId().optional(),
    teamId: validators.objectId().optional(),
    titleSubStr: Joi.string().optional(),
    descriptionSubStr: Joi.string().optional(),
    startDate: validators.startDate().optional(),
    endDate: validators.startDate().optional(),
    limit: Joi.number().integer().greater(0).optional(),
  })
    .xor('eventId', 'teamId', 'titlePartial', 'descriptionPartial')
    .and('startDate', 'endDate');

  const formData = validate(rules, req.body, { allowUnknown: true });

  let events: EventResponseDTO[] = [];
  // Search by eventId
  if (formData.eventId) {
    let eventDoc = await EventModel.findById(formData.eventId);
    if (!eventDoc) {
      throw new ServerError('event not found', StatusCodes.NOT_FOUND);
    }
    events.push(eventDocToResponseDTO(eventDoc));
  }
  // Search for events belonging to a team
  else if (formData.teamId) {
    if (!(await TeamModel.exists({ _id: formData.teamId }))) {
      throw new ServerError('team not found', StatusCodes.NOT_FOUND);
    }
    const eventDocs = (await EventModel.find({ team: formData.teamId })).map(
      (eventDoc) => {
        return eventDocToResponseDTO(eventDoc);
      },
    );
    events.push.apply(events, eventDocs);
  }
  // Search for events with a matching substring of a title
  else if (formData.titleSubStr) {
    const eventDocs = (
      await EventModel.find({
        title: { $regex: formData.titleSubStr, $options: 'i' },
      })
    ).map((eventDoc) => {
      return eventDocToResponseDTO(eventDoc);
    });
    events.push.apply(events, eventDocs);
  }
  // Search for events with a matching substring of a description
  else if (formData.descriptionSubStr) {
    const eventDocs = (
      await EventModel.find({
        description: { $regex: formData.descriptionSubStr, $options: 'i' },
      })
    ).map((eventDoc) => {
      return eventDocToResponseDTO(eventDoc);
    });
    events.push.apply(events, eventDocs);
    // Search for events falling completely withing a time bracket
  } else if (formData.startDate && formData.endDate) {
    const eventDocs = (
      await EventModel.find({
        startDate: { $gte: formData.startDate },
        endDate: { $lte: formData.endDate },
      })
    ).map((eventDoc) => {
      return eventDocToResponseDTO(eventDoc);
    });
    events.push.apply(events, eventDocs);
  }
  // Exactly one of cases above must be called, otherwise Joi validation has failed to detect malformed payload
  else {
    throw new ServerError(
      'server error: xor search payload fail',
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }

  // Limit the number of returned events
  if (formData.limit && events.length >= formData.limit) {
    events = events.splice(0, formData.limit - 1);
  }

  res.status(StatusCodes.OK).send(events);
}

export async function addUserAvailabilityById(
  req: TypedRequestBody<AddUserAvalabilityDTO>,
  res: Response<EventResponseDTO>,
) {
  // TODO: Update with Joi rules

  const rules = Joi.object<AddUserAvalabilityDTO>({
    userId: validators.objectId().required(),
    eventId: validators.objectId().required(),
    startDate: validators.startDate().required(),
    endDate: validators.endDate().required(),
    status: validators.availabilityStatus().optional(),
  });
  const formData = validate(rules, req.body, { allowUnknown: true });

  if (!(await UserModel.exists({ _id: formData.userId }))) {
    throw new ServerError('user not found', StatusCodes.NOT_FOUND);
  }

  let eventDoc = await EventModel.findById(formData.eventId);
  if (!eventDoc) {
    throw new ServerError('event not found', StatusCodes.NOT_FOUND);
  }
  const userEventAvailabilityIndex =
    eventDoc.availability.attendeeAvailability.findIndex((x) =>
      x.attendee._id.equals(formData.userId),
    );
  if (userEventAvailabilityIndex == -1) {
    eventDoc.availability.attendeeAvailability.push({
      attendee: formData.userId,
      availability: [
        {
          startDate: formData.startDate,
          endDate: formData.endDate,
          status: formData.status ?? AvailabilityStatus.Available, // Default to available
        },
      ],
      confirmed: false,
    });
  } else {
    eventDoc.availability.attendeeAvailability[
      userEventAvailabilityIndex
    ].availability.push({
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: formData.status ?? AvailabilityStatus.Available,
    });
  }

  await eventDoc.save();
  res.status(StatusCodes.OK).send(eventDocToResponseDTO(eventDoc));
}

export async function removeUserAvalabilityById(
  req: TypedRequestBody<RemoveUserAvalabilityDTO>,
  res: Response<EventResponseDTO>,
) {
  const rules = Joi.object<RemoveUserAvalabilityDTO>({
    userId: validators.objectId().required(),
    eventId: validators.objectId().required(),
    startDate: validators.startDate().required(),
    endDate: validators.endDate().required(),
  });

  const removeBracket = validate(rules, req.body, { allowUnknown: true });
  let eventDoc = await EventModel.findById(removeBracket.eventId);
  if (!eventDoc) {
    throw new ServerError('event not found', StatusCodes.NOT_FOUND);
  }

  const userEventAvailabilityIndex =
    eventDoc.availability.attendeeAvailability.findIndex((x) =>
      x.attendee._id.equals(removeBracket.userId),
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
        endDate: removeBracket.startDate,
        status: ts.status,
      });
      // Right block
      adjustedAttendeeAvailability.push({
        startDate: removeBracket.endDate,
        endDate: ts.endDate,
        status: ts.status,
      });
    } else {
      throw new ServerError(
        'error modifying date brackets',
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  });

  eventDoc.availability.attendeeAvailability[
    userEventAvailabilityIndex
  ].availability = adjustedAttendeeAvailability;
  await eventDoc.save();
  res.status(StatusCodes.OK).send();
}

export async function setEventAvailabilityConfirmation(
  req: TypedRequestBody<GetEventAvailabilityConfirmationsDTO>,
  res: Response,
) {
  const rules = Joi.object<GetEventAvailabilityConfirmationsDTO>({
    userId: validators.objectId().required(),
    eventId: validators.objectId().required(),
    confirmed: Joi.boolean().required(),
  });
  const formData = validate(rules, req.body, { allowUnknown: true });

  // Check documents exist
  if (!(await UserModel.exists({ id: formData.userId }))) {
    throw new ServerError('user not found', StatusCodes.NOT_FOUND);
  }

  const eventDoc = await EventModel.findOneAndUpdate(
    {
      _id: formData.eventId,
      'availability.attendeeAvailability': {
        $elemMatch: { attendee: formData.userId },
      },
    },

    {
      $set: {
        'availability.attendeeAvailability.$.confirmed': formData.confirmed,
      },
    },
  );

  if (!eventDoc) {
    throw new ServerError('event not found', StatusCodes.NOT_FOUND);
  }

  res.status(StatusCodes.OK).send();
}

export async function getEventAvailabilityConfirmations(
  req: TypedRequestBody<GetEventAvailabilityConfirmationsDTO>,
  res: Response<GetEventAvailabilityConfirmationsResponseDTO>,
) {
  const rules = Joi.object<GetEventAvailabilityConfirmationsDTO>({
    eventId: validators.objectId().required(),
  });
  const formData = validate(rules, req.body, { allowUnknown: true });

  const eventDoc = await EventModel.findOne({ _id: formData.eventId });
  if (!eventDoc) {
    throw new ServerError('event not found', StatusCodes.NOT_FOUND);
  }

  let confirmed = 0;
  eventDoc.availability.attendeeAvailability.forEach((avail) => {
    if (avail.confirmed) confirmed++;
  });

  res.status(StatusCodes.OK).send({ confirmed });
}
