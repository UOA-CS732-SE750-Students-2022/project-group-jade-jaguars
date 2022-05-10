import {
  IEventAvailability,
  EventModel,
  EventStatus,
  IEvent,
  AvailabilityStatus,
  ITimeBracket,
} from '../schemas/event.schema';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { TypedRequestBody } from '../libs/utils.lib';
import { returnError } from '../libs/error.lib';
import Joi from 'joi';
import { validate, validators } from '../libs/validate.lib';
import { UserModel } from '../schemas/user.schema';
import { ITeam, TeamModel } from '../schemas/team.schema';
import server from '../app';
import { createEmitAndSemanticDiagnosticsBuilderProgram } from 'typescript';

export interface CreateEventDTO {
  _id: string;
  title: string;
  description?: string;
  status?: EventStatus;
  startDate: Date;
  endDate: Date;
  availability?: IEventAvailability;
  location?: string;
  team?: string; // id
  admin: string; // id
}

// Can change everything but the id
export interface PatchEventDTO extends Partial<Omit<IEvent, '_id'>> {}

export interface SearchEventDTO {
  teamId?: string;
  startDate?: Date;
  endDate?: Date;
  titleSubStr?: string;
  descriptionSubStr?: string;
  limit?: number;
}

export interface AddUserAvailabilityDTO {
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

export interface EventResponseDTO {
  id: string;
  title: string;
  description?: string;
  status: EventStatus;
  startDate: Date;
  endDate: Date;
  availability: IEventAvailability;
  location?: string;
  team: string;
  admin: string;
}

// Helper function for mapping a event document to a response object
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
    team: eventDoc.team,
    admin: eventDoc.admin,
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
    // Validation failed, headers have been set, return
    if (!formData) return;

    const eventDoc = await EventModel.findById(formData.eventId);
    if (!eventDoc) {
      return returnError(Error('Event Not Found'), res, StatusCodes.NOT_FOUND);
    }
    res
      .status(StatusCodes.OK)
      .send(eventDocToResponseDTO(eventDoc.toObject({ virtuals: true })));
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
      availability: Joi.array().optional(),
      location: Joi.string().optional(),
      team: validators.id().optional(),
      admin: validators.id().optional(),
    });
    const formData = validate(res, rules, req.body, { allowUnknown: true });
    // Validation failed, headers have been set, return
    if (!formData) return;

    const eventDoc = await EventModel.create(formData);
    res
      .status(StatusCodes.CREATED)
      .send(eventDocToResponseDTO(eventDoc.toObject({ virtuals: true })));
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
    // Validation failed, headers have been set, return
    if (!formData) return;

    const eventDoc = await EventModel.findOneAndUpdate(
      { _id: eventId },
      { $set: formData },
      { new: true },
    );
    if (!eventDoc) {
      return returnError(Error('Event Not Found'), res, StatusCodes.NOT_FOUND);
    }

    // Send updated event via socket IO
    server.webSocket.send(`event:${eventId}`, eventDoc);

    res
      .status(StatusCodes.OK)
      .send(eventDocToResponseDTO(eventDoc.toObject({ virtuals: true })));
  } catch (err) {
    returnError(err, res);
  }
}

export async function deleteEventById(req: Request, res: Response) {
  try {
    const eventId = req.params.eventId;

    const rules = Joi.object<{ eventId: string }>({
      eventId: validators.id().required(),
    });
    const formData = validate(res, rules, { eventId }, { allowUnknown: true });
    // Validation failed, headers have been set, return
    if (!formData) return;

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
    // Validation failed, headers have been set, return
    if (!formData) return;

    let events: EventResponseDTO[] = [];
    // Search for events belonging to a team
    if (formData.teamId) {
      if (!(await TeamModel.exists({ _id: formData.teamId }))) {
        return returnError(Error('Team Not Found'), res, StatusCodes.NOT_FOUND);
      }
      const eventDocs = (await EventModel.find({ team: formData.teamId })).map(
        (eventDoc) => {
          return eventDocToResponseDTO(eventDoc.toObject({ virtuals: true }));
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
        return eventDocToResponseDTO(eventDoc.toObject({ virtuals: true }));
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
      // Validation failed, headers have been set, return
      if (!formData) return;

      const eventDocs = (
        await EventModel.find({
          startDate: { $gte: formData.startDate },
          endDate: { $lte: formData.endDate },
        })
      ).map((eventDoc) => {
        return eventDocToResponseDTO(eventDoc.toObject({ virtuals: true }));
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
    // Validation failed, headers have been set, return
    if (!formData) return;

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
  req: TypedRequestBody<AddUserAvailabilityDTO>,
  res: Response<EventResponseDTO | string>,
) {
  try {
    let eventId = req.params.eventId;

    const rules = Joi.object<AddUserAvailabilityDTO & { eventId: string }>({
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
    // Validation failed, headers have been set, return
    if (!formData) return;

    if (!(await UserModel.exists({ _id: formData.userId }))) {
      return returnError(Error('User Not Found'), res, StatusCodes.NOT_FOUND);
    }

    const eventDoc = await EventModel.findById(formData.eventId)
      .populate<{ team: ITeam }>('team')
      .populate<{ availability: IEventAvailability }>('availability');

    if (!eventDoc) {
      return returnError(Error('Event Not Found'), res, StatusCodes.NOT_FOUND);
    }

    // If the event has a team then only users belonging to that team can add availability
    if (eventDoc.team) {
      // All members of the team including the admin
      const members = eventDoc.team.members + eventDoc.team.admin;
      if (!members.includes(formData.userId)) {
        return returnError(
          Error('User Must Be Part Of Team To Add Availability'),
          res,
          StatusCodes.BAD_REQUEST,
        );
      }
    }

    // timeList will contain the list of potential times split up among different days.
    let timeList = [];

    const daysInTB =
      (formData.endDate.getTime() - formData.startDate.getTime()) /
      (1000 * 3600 * 24); // How many days to split into.

    const startDate = new Date(formData.startDate);

    // Separate out each day.
    for (let i = 0; i < daysInTB; i++) {
      let myEndTime = new Date(formData.endDate);
      if (
        startDate.getHours() == 0 &&
        myEndTime.getHours() == 0 &&
        startDate.getMinutes() == 0 &&
        myEndTime.getMinutes() == 0
      ) {
        myEndTime.setDate(startDate.getDate() + 1);
      } else {
        if (
          formData.endDate.getHours() < 12 &&
          formData.startDate.getHours() >= 12
        ) {
          myEndTime.setDate(startDate.getDate() + 1);
        } else {
          myEndTime.setDate(startDate.getDate());
        }
      }
      let newStartTime = new Date(startDate);
      let newEndTime = new Date(myEndTime);
      timeList.push({
        startDate: newStartTime,
        endDate: newEndTime,
      });
      startDate.setDate(startDate.getDate() + 1);
    }

    const userEventAvailabilityIndex =
      eventDoc.availability.attendeeAvailability.findIndex(
        (x) => x.attendee === formData.userId,
      );
    if (userEventAvailabilityIndex == -1) {
      eventDoc.availability.attendeeAvailability.push({
        attendee: formData.userId,
        availability: timeList.map((time) => {
          return {
            startDate: time.startDate,
            endDate: time.endDate,
            status: formData.status ?? AvailabilityStatus.Available, // Default to available
          };
        }),
      });
    } else {
      timeList.map((time) => {
        eventDoc.availability.attendeeAvailability[
          userEventAvailabilityIndex
        ].availability.push({
          startDate: time.startDate,
          endDate: time.endDate,
          status: formData.status ?? AvailabilityStatus.Available,
        });
      });
    }

    await eventDoc.save();

    // Send updated event via socket IO
    server.webSocket.send(`event:${eventId}`, eventDoc);
    res
      .status(StatusCodes.OK)
      .send(eventDocToResponseDTO(eventDoc.toObject({ virtuals: true })));
  } catch (err) {
    returnError(err, res);
  }
}

export async function removeUserAvailabilityById(
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
    // Validation failed, headers have been set, return
    if (!formData) return;

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
      return returnError(
        Error('Bad Request, Time Bracket Does Not Exist'),
        res,
        StatusCodes.BAD_REQUEST,
      );
    }

    // timeList will contain the list of potential times split up among different days.
    let timeList = [];

    const daysInTB =
      (formData.endDate.getTime() - formData.startDate.getTime()) /
      (1000 * 3600 * 24); // How many days to split into.

    const startDate = new Date(formData.startDate);

    // Separate out each day.
    for (let i = 0; i < daysInTB; i++) {
      let myEndTime = new Date(formData.endDate);
      if (
        startDate.getHours() == 0 &&
        myEndTime.getHours() == 0 &&
        startDate.getMinutes() == 0 &&
        myEndTime.getMinutes() == 0
      ) {
        myEndTime.setDate(startDate.getDate() + 1);
      } else {
        if (
          formData.endDate.getHours() < 12 &&
          formData.startDate.getHours() >= 12
        ) {
          myEndTime.setDate(startDate.getDate() + 1);
        } else {
          myEndTime.setDate(startDate.getDate());
        }
      }
      let newStartTime = new Date(startDate);
      let newEndTime = new Date(myEndTime);
      timeList.push({
        startDate: newStartTime,
        endDate: newEndTime,
      });
      startDate.setDate(startDate.getDate() + 1);
    }

    // Sweep though availability brackets in order to edit to remove parts of or whole brackets
    let attendeeAvailability = [];
    let adjustedAttendeeAvailability = [];

    const length = timeList.length;

    for (let i = 0; i < length; i++) {
      if (i == 0) {
        attendeeAvailability =
          eventDoc.availability.attendeeAvailability[userEventAvailabilityIndex]
            .availability;
      } else {
        attendeeAvailability = [...adjustedAttendeeAvailability];
      }
      adjustedAttendeeAvailability = [];
      const time = timeList[i];
      attendeeAvailability.forEach((ts) => {
        // Existing bracket falls entirely within removal bracket
        if (ts.startDate >= time.startDate && ts.endDate <= time.endDate) {
        }
        // Existing bracket starting left side removed
        else if (
          ts.startDate >= time.startDate &&
          ts.endDate >= time.endDate &&
          ts.startDate < time.endDate
        ) {
          ts.startDate = time.endDate;
          adjustedAttendeeAvailability.push(ts);
        }
        // Existing bracket ending right side removed
        else if (
          ts.startDate <= time.startDate &&
          ts.endDate <= time.endDate &&
          time.startDate < ts.endDate
        ) {
          ts.endDate = time.startDate;
          adjustedAttendeeAvailability.push(ts);
        }
        // Middle removed
        else if (ts.startDate <= time.startDate && ts.endDate >= time.endDate) {
          // Start left block
          adjustedAttendeeAvailability.push({
            startDate: ts.startDate,
            endDate: time.startDate,
            status: ts.status,
          });
          // End right block
          adjustedAttendeeAvailability.push({
            startDate: time.endDate,
            endDate: ts.endDate,
            status: ts.status,
          });
        } else {
          adjustedAttendeeAvailability.push({
            startDate: ts.startDate,
            endDate: ts.endDate,
            status: ts.status,
          });
        }
      });
    }

    eventDoc.availability.attendeeAvailability[
      userEventAvailabilityIndex
    ].availability = adjustedAttendeeAvailability;
    await eventDoc.save();

    // Send updated event via socket IO
    server.webSocket.send(`event:${eventId}`, eventDoc);

    res.sendStatus(StatusCodes.OK);
  } catch (err) {
    returnError(err, res);
  }
}
