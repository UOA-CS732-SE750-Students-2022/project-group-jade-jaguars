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
import { ITeam, TeamModel } from '../schemas/team.schema';
import Server from 'src/server';

export interface CreateEventDTO {
  title: string;
  description?: string;
  status?: EventStatus;
  startDate: Date;
  endDate: Date;
  availability: IEventAvailability;
  location: string;
  team?: Types.ObjectId;
}

export interface PatchEventDTO extends Partial<IEvent> {
  eventId: Types.ObjectId;
}

export interface SearchEventDTO {
  teamId?: Types.ObjectId;
  startDate?: Date;
  endDate?: Date;
  titleSubStr?: string;
  descriptionSubStr?: string;
  limit?: number;
}

// TODO: For now include userId in this payload, eventually this property should be removed and instead using the authToken we look up the userId
export interface AddUserAvalabilityDTO {
  userId: string;
  startDate: Date;
  endDate: Date;
  status?: AvailabilityStatus;
}

export interface RemoveUserAvalabilityDTO {
  userId: string;
  eventId: string;
  startDate: Date;
  endDate: Date;
}

export interface SetEventAvailabilityConfirmationDTO {
  userId: Types.ObjectId;
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
  description?: string;
  status: EventStatus;
  startDate: Date;
  endDate: Date;
  availability: IEventAvailability;
  location?: string;
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
    description: eventDoc.description,
    location: eventDoc.location,
    identifier: eventDoc.identifier,
    team: eventDoc.team,
  };
}

export async function getEventById(
  req: Request,
  res: Response<EventResponseDTO | string>,
) {
  let eventId;
  try {
    eventId = convertToObjectId(req.params.eventId);
  } catch (e: unknown) {
    if (!(e instanceof ServerError)) throw e;
    res.status(e.status).send(e.message);
  }

  const eventDoc = await EventModel.findById(eventId);
  if (!eventDoc) {
    res.status(StatusCodes.NOT_FOUND).send('event not found');
  }
  res.status(StatusCodes.OK).send(eventDocToResponseDTO(eventDoc));
}

export async function createEvent(
  req: TypedRequestBody<CreateEventDTO>,
  res: Response<EventResponseDTO>,
) {
  console.log('hit create endpoint!');
  // TODO: create/use remainder of validation rules
  const rules = Joi.object<CreateEventDTO>({
    title: validators.title().required(),
    description: validators.description().optional(),
    status: validators.availabilityStatus().optional(),
    startDate: validators.startDate().required(),
    endDate: validators.endDate().required(),
    location: validators.location().optional(),
    team: validators.objectId().optional(),
  });
  const formData = validate(rules, req.body, { allowUnknown: true });

  const eventDoc = await EventModel.create(formData);
  res.status(StatusCodes.CREATED).send(eventDocToResponseDTO(eventDoc));
}

export async function patchEventById(
  req: TypedRequestBody<PatchEventDTO>,
  res: Response<EventResponseDTO | string>,
) {
  let eventId;
  try {
    eventId = convertToObjectId(req.params.eventId);
  } catch (e: unknown) {
    if (!(e instanceof ServerError)) throw e;
    res.status(e.status).send(e.message);
  }

  const rules = Joi.object<PatchEventDTO>({
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
    { _id: eventId },
    { $set: formData },
    { new: true },
  );

  if (!eventDoc) {
    res.status(StatusCodes.NOT_FOUND).send('event not found');
  } else {
    res.status(StatusCodes.OK).send(eventDocToResponseDTO(eventDoc));
  }
}

export async function deleteEventById(req: Request, res: Response) {
  let eventId;
  try {
    eventId = convertToObjectId(req.params.eventId);
  } catch (e: unknown) {
    if (!(e instanceof ServerError)) throw e;
    res.status(e.status).send(e.message);
  }

  const deleteResult = await EventModel.deleteOne({ _id: eventId });
  if (deleteResult.deletedCount === 0) {
    res.status(StatusCodes.NOT_FOUND).send('event not found');
  } else {
    res.sendStatus(StatusCodes.NO_CONTENT);
  }
}

export async function searchEvent(
  req: TypedRequestBody<SearchEventDTO>,
  res: Response<EventResponseDTO[] | string>,
) {
  const rules = Joi.object<SearchEventDTO>({
    teamId: validators.objectId().optional(),
    titleSubStr: Joi.string().optional(),
    descriptionSubStr: Joi.string().optional(),
  }).oxor('teamId', 'titleSubStr', 'descriptionSubStr');

  let formData = validate(rules, req.body, { allowUnknown: true });

  let events: EventResponseDTO[] = [];
  // Search for events belonging to a team
  if (formData.teamId) {
    if (!(await TeamModel.exists({ _id: formData.teamId }))) {
      res.status(StatusCodes.NOT_FOUND).send('team not found');
      return;
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
    //XXX: Workaround with limitation of Joi single rule application
    const dateRules = Joi.object<SearchEventDTO>({
      startDate: validators.startDate().optional(),
      endDate: validators.startDate().optional(),
    }).and('startDate', 'endDate');

    formData = validate(dateRules, req.body, { allowUnknown: true });

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
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send('server error: xor search payload fail');
  }

  //XXX: Workaround with limitation of Joi single rule application
  const limitRules = Joi.object<SearchEventDTO>({
    limit: Joi.number().greater(0).optional(),
  });
  formData = validate(limitRules, req.body, { allowUnknown: true });

  // Limit the number of returned events
  if (formData.limit && events.length >= formData.limit) {
    events = events.slice(0, formData.limit);
  }

  res.status(StatusCodes.OK).send(events);
}

export async function addUserAvailabilityById(
  req: TypedRequestBody<AddUserAvalabilityDTO>,
  res: Response<EventResponseDTO | string>,
) {
  let eventId;
  try {
    eventId = convertToObjectId(req.params.eventId);
  } catch (e: unknown) {
    if (!(e instanceof ServerError)) throw e;
    res.status(e.status).send(e.message);
  }

  const payload = {
    eventId,
    ...req.body,
  };

  const rules = Joi.object<AddUserAvalabilityDTO>({
    userId: validators.objectId().required(),
    startDate: validators.startDate().required(),
    endDate: validators.endDate().required(),
    status: validators.availabilityStatus().optional(),
  });

  const formData = validate(rules, payload, { allowUnknown: true });

  if (!(await UserModel.exists({ _id: formData.userId }))) {
    res.status(StatusCodes.NOT_FOUND).send('user not found');
    return;
  }

  let eventDoc = await EventModel.findById(eventId);
  if (!eventDoc) {
    res.status(StatusCodes.NOT_FOUND).send('event not found');
    return;
  }

  const userEventAvailabilityIndex =
    eventDoc.availability.attendeeAvailability.findIndex(
      (x) => x.attendee === formData.userId,
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
  req: Request,
  res: Response<EventResponseDTO | string>,
) {
  let eventId: Types.ObjectId;
  let userId: string;
  try {
    eventId = convertToObjectId(req.params.eventId);
    userId = req.query.userId as string;
  } catch (e: unknown) {
    if (!(e instanceof ServerError)) throw e;
    res.status(e.status).send(e.message);
  }

  const checkDatePayload = {
    startDate: new Date(req.query.startDate as string),
    endDate: new Date(req.query.endDate as string),
  };

  const rules = Joi.object({
    startDate: validators.startDate().required(),
    endDate: validators.endDate().required(),
  });

  const removeBracket = validate(rules, checkDatePayload, {
    allowUnknown: true,
  });

  let eventDoc = await EventModel.findById(eventId);
  if (!eventDoc) {
    res.status(StatusCodes.NOT_FOUND).send('event not found');
    return;
  }

  const userEventAvailabilityIndex =
    eventDoc.availability.attendeeAvailability.findIndex(
      (x) => x.attendee === userId,
    );

  // Can't remove availability timebracket if it doesn't exist for the user
  if (userEventAvailabilityIndex === -1) {
    res.sendStatus(StatusCodes.BAD_REQUEST);
    return;
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
    // Existing bracket starting left side removed
    else if (
      ts.startDate >= removeBracket.startDate &&
      ts.endDate >= removeBracket.endDate
    ) {
      ts.startDate = removeBracket.endDate;
      adjustedAttendeeAvailability.push(ts);
    }
    // Existing bracket ending right side removed
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
      // Start left block
      adjustedAttendeeAvailability.push({
        startDate: ts.startDate,
        endDate: removeBracket.startDate,
        status: ts.status,
      });
      // End right block
      adjustedAttendeeAvailability.push({
        startDate: removeBracket.endDate,
        endDate: ts.endDate,
        status: ts.status,
      });
    } else {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send('error modifying date brackets');
    }
  });

  eventDoc.availability.attendeeAvailability[
    userEventAvailabilityIndex
  ].availability = adjustedAttendeeAvailability;
  await eventDoc.save();
  res.sendStatus(StatusCodes.OK);
}

export async function setEventAvailabilityConfirmation(
  req: TypedRequestBody<SetEventAvailabilityConfirmationDTO>,
  res: Response,
) {
  let eventId: Types.ObjectId;
  try {
    eventId = convertToObjectId(req.params.eventId);
  } catch (e: unknown) {
    if (!(e instanceof ServerError)) throw e;
    res.status(e.status).send(e.message);
  }

  const rules = Joi.object<SetEventAvailabilityConfirmationDTO>({
    userId: validators.objectId().required(),
    confirmed: Joi.boolean().required(),
  });
  const formData = validate(rules, req.body, { allowUnknown: true });

  // Check documents exist
  if (!(await UserModel.exists({ id: formData.userId }))) {
    res.status(StatusCodes.NOT_FOUND).send('user not found');
    return;
  }

  const eventDoc = await EventModel.findOneAndUpdate(
    {
      _id: eventId,
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
    res.status(StatusCodes.NOT_FOUND).send('event not found');
    return;
  }

  res.sendStatus(StatusCodes.OK);
}

export async function getEventAvailabilityConfirmations(
  req: Request,
  res: Response<GetEventAvailabilityConfirmationsResponseDTO | string>,
) {
  let eventId: Types.ObjectId;
  try {
    eventId = convertToObjectId(req.params.eventId);
  } catch (e: unknown) {
    if (!(e instanceof ServerError)) throw e;
    res.status(e.status).send(e.message);
  }

  const eventDoc = await EventModel.findOne({ _id: eventId });
  if (!eventDoc) {
    res.status(StatusCodes.NOT_FOUND).send('event not found');
    return;
  }

  let confirmed = 0;
  eventDoc.availability.attendeeAvailability.forEach((avail) => {
    if (avail.confirmed) confirmed++;
  });

  res.status(StatusCodes.OK).send({ confirmed });
}
