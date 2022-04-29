import {
  IEventAvailability,
  EventModel,
  EventStatus,
  IEvent,
  AvailabilityStatus,
} from '../schemas/event.schema';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { TypedRequestBody } from '../libs/utils.lib';
import { returnError } from '../libs/error.lib';
import Joi from 'joi';
import { validate, validators } from '../libs/validate.lib';
import { UserModel } from '../schemas/user.schema';
import { TeamModel } from '../schemas/team.schema';

export interface CreateEventDTO {
  _id: string;
  title: string;
  description?: string;
  status?: EventStatus;
  startDate: Date;
  endDate: Date;
  availability: IEventAvailability;
  location: string;
  team?: string;
}

export interface PatchEventDTO extends Partial<IEvent> {
  eventId: string;
}

export interface SearchEventDTO {
  teamId?: string;
  startDate?: Date;
  endDate?: Date;
  titleSubStr?: string;
  descriptionSubStr?: string;
  limit?: number;
}

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
  userId: string;
  confirmed: Boolean;
}

export interface GetEventAvailabilityConfirmationsDTO {
  eventId: string;
}

export interface GetEventAvailabilityConfirmationsResponseDTO {
  confirmed: Number;
}

export interface EventResponseDTO {
  id: string;
  title: string;
  description?: string;
  status: EventStatus;
  startDate: Date;
  endDate: Date;
  availability: IEventAvailability;
  location?: string;
  identifier: string;
  team: string;
}

// Helper function for mapping a event documetn to a respone object
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
  try {
    const eventId = req.params.eventId;

    const rules = Joi.object<{ eventId: string }>({
      eventId: validators.title().required(),
    });
    const formData = validate(res, rules, { eventId }, { allowUnknown: true });

    const eventDoc = await EventModel.findById(formData.eventId);
    if (!eventDoc) {
      return returnError(Error('Event Not Found'), res, StatusCodes.NOT_FOUND);
    }
    res.status(StatusCodes.OK).send(eventDocToResponseDTO(eventDoc));
  } catch (err) {
    returnError(err, res);
  }
}

export async function createEvent(
  req: TypedRequestBody<CreateEventDTO>,
  res: Response<EventResponseDTO>,
) {
  try {
    const rules = Joi.object<CreateEventDTO>({
      title: validators.title().required(),
      description: validators.description().optional(),
      status: validators.eventStatus().optional(),
      startDate: validators.startDate().required(),
      endDate: validators.endDate().required(),
      location: validators.location().optional(),
      team: validators.id().optional(),
    });

    const formData = validate(res, rules, req.body, { allowUnknown: true });
    const eventDoc = await EventModel.create(formData);
    res.status(StatusCodes.CREATED).send(eventDocToResponseDTO(eventDoc));
  } catch (err) {
    returnError(err, res);
  }
}

export async function patchEventById(
  req: TypedRequestBody<PatchEventDTO>,
  res: Response<EventResponseDTO | string>,
) {
  try {
    const eventId = req.params.eventId;

    const rules = Joi.object<PatchEventDTO & { eventId: string }>({
      eventId: validators.id().required(),
      title: validators.title().optional(),
      description: validators.description().optional(),
      status: validators.availabilityStatus().optional(),
      startDate: validators.startDate().optional(),
      endDate: validators.endDate().optional(),
      location: validators.location().optional(),
      team: validators.id().optional(),
    });
    const formData = validate(
      res,
      rules,
      { ...req.body, eventId },
      { allowUnknown: true },
    );

    const eventDoc = await EventModel.findOneAndUpdate(
      { _id: eventId },
      { $set: formData },
      { new: true },
    );
    if (!eventDoc) {
      return returnError(Error('Event Not Found'), res, StatusCodes.NOT_FOUND);
    }
    res.status(StatusCodes.OK).send(eventDocToResponseDTO(eventDoc));
  } catch (err) {
    returnError(err, res);
  }
}

export async function deleteEventById(req: Request, res: Response) {
  try {
    const eventId = req.params.eventId;

    const rules = Joi.object<{ eventId: string }>({
      eventId: validators.title().required(),
    });
    const formData = validate(res, rules, { eventId }, { allowUnknown: true });

    const deleteResult = await EventModel.deleteOne({ _id: formData.eventId });
    if (deleteResult.deletedCount === 0) {
      return returnError(Error('Event Not Found'), res, StatusCodes.NOT_FOUND);
    }

    res.sendStatus(StatusCodes.NO_CONTENT);
  } catch (err) {
    returnError(err, res);
  }
}

export async function searchEvent(
  req: TypedRequestBody<SearchEventDTO>,
  res: Response<EventResponseDTO[] | string>,
) {
  try {
    const rules = Joi.object<SearchEventDTO>({
      teamId: validators.id().optional(),
      titleSubStr: Joi.string().optional(),
      descriptionSubStr: Joi.string().optional(),
    }).oxor('teamId', 'titleSubStr', 'descriptionSubStr');

    let formData = validate(res, rules, req.body, { allowUnknown: true });

    let events: EventResponseDTO[] = [];
    // Search for events belonging to a team
    if (formData.teamId) {
      if (!(await TeamModel.exists({ _id: formData.teamId }))) {
        return returnError(Error('Team Not Found'), res, StatusCodes.NOT_FOUND);
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

      formData = validate(res, dateRules, req.body, { allowUnknown: true });

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
      returnError(
        new Error('XOR Search Payload Fail'),
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
      return;
    }

    //XXX: Workaround with limitation of Joi single rule application
    const limitRules = Joi.object<SearchEventDTO>({
      limit: Joi.number().greater(0).optional(),
    });
    formData = validate(res, limitRules, req.body, { allowUnknown: true });

    // Limit the number of returned events
    if (formData.limit && events.length >= formData.limit) {
      events = events.slice(0, formData.limit);
    }

    res.status(StatusCodes.OK).send(events);
  } catch (err) {
    returnError(err, res);
  }
}

export async function addUserAvailabilityById(
  req: TypedRequestBody<AddUserAvalabilityDTO>,
  res: Response<EventResponseDTO | string>,
) {
  try {
    let eventId = req.params.eventId;

    const rules = Joi.object<AddUserAvalabilityDTO & { eventId: string }>({
      userId: validators.id().required(),
      startDate: validators.startDate().required(),
      endDate: validators.endDate().required(),
      status: validators.availabilityStatus().optional(),
    });
    const formData = validate(
      res,
      rules,
      { ...req.body, eventId },
      { allowUnknown: true },
    );

    if (!(await UserModel.exists({ _id: formData.userId }))) {
      return returnError(Error('User Not Found'), res, StatusCodes.NOT_FOUND);
    }

    let eventDoc = await EventModel.findById(formData.eventId);
    if (!eventDoc) {
      return returnError(Error('Event Not Found'), res, StatusCodes.NOT_FOUND);
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
  } catch (err) {
    returnError(err, res);
  }
}

export async function removeUserAvalabilityById(
  req: Request,
  res: Response<EventResponseDTO | string>,
) {
  try {
    const eventId = req.params.eventId;
    const userId = req.query.userId as string;

    const payload = {
      eventId,
      userId,
      startDate: new Date(req.query.startDate as string),
      endDate: new Date(req.query.endDate as string),
    };

    const rules = Joi.object<{
      startDate: Date;
      endDate: Date;
      eventId: string;
      userId: string;
    }>({
      eventId: validators.id().required(),
      userId: validators.id().required(),
      startDate: validators.startDate().required(),
      endDate: validators.endDate().required(),
    });

    const formData = validate(res, rules, payload, {
      allowUnknown: true,
    });

    let eventDoc = await EventModel.findById(formData.eventId);
    if (!eventDoc) {
      return returnError(Error('Event Not Found'), res, StatusCodes.NOT_FOUND);
    }

    const userEventAvailabilityIndex =
      eventDoc.availability.attendeeAvailability.findIndex(
        (x) => x.attendee === formData.userId,
      );

    // Can't remove availability timebracket if it doesn't exist for the user
    if (userEventAvailabilityIndex === -1) {
      return returnError(Error('Bad Request'), res, StatusCodes.BAD_REQUEST);
    }

    // Sweep though availability brackets in order to edit to remove parts of or whole brackets
    let adjustedAttendeeAvailability = [];

    eventDoc.availability.attendeeAvailability[
      userEventAvailabilityIndex
    ].availability.forEach((ts) => {
      // Existing bracket falls entirely within removal bracket
      if (
        ts.startDate >= formData.startDate &&
        ts.endDate <= formData.endDate
      ) {
      }
      // Existing bracket starting left side removed
      else if (
        ts.startDate >= formData.startDate &&
        ts.endDate >= formData.endDate
      ) {
        ts.startDate = formData.endDate;
        adjustedAttendeeAvailability.push(ts);
      }
      // Existing bracket ending right side removed
      else if (
        ts.startDate <= formData.startDate &&
        ts.endDate <= formData.endDate
      ) {
        ts.endDate = formData.startDate;
        adjustedAttendeeAvailability.push(ts);
      }
      // Middle removed
      else if (
        ts.startDate <= formData.startDate &&
        ts.endDate >= formData.endDate
      ) {
        // Start left block
        adjustedAttendeeAvailability.push({
          startDate: ts.startDate,
          endDate: formData.startDate,
          status: ts.status,
        });
        // End right block
        adjustedAttendeeAvailability.push({
          startDate: formData.endDate,
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
  } catch (err) {
    returnError(err, res);
  }
}

export async function setEventAvailabilityConfirmation(
  req: TypedRequestBody<SetEventAvailabilityConfirmationDTO>,
  res: Response,
) {
  try {
    const eventId = req.params.eventId;
    const rules = Joi.object<
      SetEventAvailabilityConfirmationDTO & { eventId: string }
    >({
      eventId: validators.id().required(),
      userId: validators.id().required(),
      confirmed: Joi.boolean().required(),
    });
    const formData = validate(
      res,
      rules,
      { ...req.body, eventId },
      { allowUnknown: true },
    );

    // Check documents exist
    if (!(await UserModel.exists({ id: formData.userId }))) {
      return returnError(Error('User Not FOund'), res, StatusCodes.NOT_FOUND);
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
      return returnError(Error('Event Not Found'), res, StatusCodes.NOT_FOUND);
    }

    res.sendStatus(StatusCodes.OK);
  } catch (err) {
    returnError(err, res);
  }
}

export async function getEventAvailabilityConfirmations(
  req: Request,
  res: Response<GetEventAvailabilityConfirmationsResponseDTO | string>,
) {
  try {
    const eventId = req.params.eventId;

    const rules = Joi.object<{ eventId: string }>({
      eventId: validators.title().required(),
    });
    const formData = validate(res, rules, { eventId }, { allowUnknown: true });

    const eventDoc = await EventModel.findOne({ _id: formData.eventId });
    if (!eventDoc) {
      return returnError(Error('Event Not Found'), res, StatusCodes.NOT_FOUND);
    }

    let confirmed = 0;
    eventDoc.availability.attendeeAvailability.forEach((avail) => {
      if (avail.confirmed) confirmed++;
    });

    res.status(StatusCodes.OK).send({ confirmed });
  } catch (err) {
    returnError(err, res);
  }
}
