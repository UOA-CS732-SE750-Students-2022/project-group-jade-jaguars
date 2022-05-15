import {
  IEventAvailability,
  EventModel,
  EventStatus,
  IEvent,
  AvailabilityStatus,
  ITimeBracket,
} from '../schemas/event.schema';
import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import { validate, validators } from '../libs/validate.lib';
import { Request, Response } from 'express';
import { TypedRequestBody } from '../libs/utils.lib';
import { returnError } from '../libs/error.lib';
import { addToUserEventSet } from '../service/user.service';
import { UserModel } from '../schemas/user.schema';
import { ITeam, TeamModel } from '../schemas/team.schema';
import server from '../app';
import { UserResponseDTO } from './user.controller';
import { splitDays } from '../service/event.service';

// DTO objects

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
  repeat?: boolean;
}

// Hvae the ability to change everything but the id when updating an event
export interface PatchEventDTO extends Partial<Omit<IEvent, '_id'>> {}

export interface SearchEventDTO {
  userId?: string;
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

interface FinalizeEventDateDTO {
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

// Find an event by a eventId
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

// Create an event
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
      repeat: Joi.boolean().optional(),
    });
    const formData = validate(res, rules, req.body, { allowUnknown: true });
    // Validation failed, headers have been set, return
    if (!formData) return;

    // Create event
    let eventDoc = await EventModel.create(formData);
    const eventId = eventDoc._id;

    // Add event to user documents
    const eventDocPopulated = await EventModel.findById(eventId).populate<{
      team: ITeam;
    }>('team');
    // Add event to team users
    if (eventDocPopulated.team) {
      // Add event to team admin
      await addToUserEventSet(eventDocPopulated.team.admin, eventId);
      // Add event to team  members
      for (const memberId of eventDocPopulated.team.members) {
        await addToUserEventSet(memberId, eventId);
      }

      await eventDocPopulated.save();

      // Add event to team
      const teamDoc = await TeamModel.findById(eventDocPopulated.team._id);
      teamDoc.events.push(eventId);
      await teamDoc.save();
    }
    // Also add it to the admin of the event
    await addToUserEventSet(formData.admin, eventId);

    res
      .status(StatusCodes.CREATED)
      .send(eventDocToResponseDTO(eventDoc.toObject({ virtuals: true })));
  } catch (err) {
    returnError(err, res);
  }
}

// Chnage certain properties of an event
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

    // If a team is present then we have to add the event to the team
    if (formData.team) {
      const teamDoc = await TeamModel.findById(formData.team);
      teamDoc.events.push(formData.eventId);
      await teamDoc.save();
    }

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

// Remove an event
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

// Search for an event
export async function searchEvent(
  req: TypedRequestBody<SearchEventDTO>,
  res: Response<EventResponseDTO[] | string>,
) {
  try {
    const rules = Joi.object<SearchEventDTO>({
      userId: validators.id().optional(),
      teamId: validators.id().optional(),
      titleSubStr: Joi.string().optional(),
      descriptionSubStr: Joi.string().optional(),
    }).oxor('userId', 'teamId', 'titleSubStr', 'descriptionSubStr');

    let formData = validate(res, rules, req.body, { allowUnknown: true });
    // Validation failed, headers have been set, return
    if (!formData) return;

    let events: EventResponseDTO[] = [];

    // Search for events belonging to a user
    if (formData.userId) {
      if (!(await UserModel.exists({ _id: formData.userId }))) {
        return returnError(Error('User Not Found'), res, StatusCodes.NOT_FOUND);
      }

      // This logic is slightly complex, either the user
      // XXX: Filter through all event docs, this is just a lot easier for the moment
      let eventDocs = (
        await EventModel.find({})
          .populate<{ team: ITeam }>('team')
          .populate<{ availability: IEventAvailability }>('availability')
      ).filter((e) => {
        // Check team members
        if (e.team) {
          const allTeamMembers = e.team.members.concat(e.team.admin);
          if (allTeamMembers.some((m) => m === formData.userId)) {
            return true;
          } else {
            return false;
          }
        }
        // Check availability for membership
        else {
          // Get all unique attendees who have added an availability
          const attendees = e.availability.attendeeAvailability.map(
            (a) => a.attendee,
          );
          if (attendees.some((m) => m === formData.userId)) {
            return true;
          } else {
            return false;
          }
        }
      });

      events.push.apply(
        events,
        eventDocs.map((eventDoc) => {
          return eventDocToResponseDTO(eventDoc.toObject({ virtuals: true }));
        }),
      );
    }

    // Search for events belonging to a team
    else if (formData.teamId) {
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

// Add a users availability to an event
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

    // Split the times into individual days
    const timeList = splitDays(formData.startDate, formData.endDate);

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

    // If the user hasn't had the event added to their document then add it
    await addToUserEventSet(formData.userId, eventId);

    // Send updated event via socket IO
    server.webSocket.send(`event:${eventId}`, eventDoc);
    res
      .status(StatusCodes.OK)
      .send(eventDocToResponseDTO(eventDoc.toObject({ virtuals: true })));
  } catch (err) {
    returnError(err, res);
  }
}

// Remove the users availability between two different dates (inclusive)
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

    const splitDates = splitDays(formData.startDate, formData.endDate);

    // Sweep though availability brackets in order to edit to remove parts of or whole brackets
    let attendeeAvailability = [];
    let adjustedAttendeeAvailability = [];

    for (let i = 0; i < splitDates.length; i++) {
      // First sweep though the attendees availability
      if (i == 0) {
        attendeeAvailability =
          eventDoc.availability.attendeeAvailability[userEventAvailabilityIndex]
            .availability;
      }
      // Not the first sweep though the attendees availability, needs to continue to be mutated and adjusted
      else {
        attendeeAvailability = [...adjustedAttendeeAvailability];
      }
      adjustedAttendeeAvailability = [];
      const time = splitDates[i];
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

    // If the user hasn't had the event added to their document then add it
    // This should include when removing availability from the event
    await addToUserEventSet(formData.userId, eventId);

    // Send updated event via socket IO
    server.webSocket.send(`event:${eventId}`, eventDoc);

    res.sendStatus(StatusCodes.OK);
  } catch (err) {
    returnError(err, res);
  }
}

// Fetch a particular users availability
export async function getEventUsersById(
  req: Request,
  res: Response<UserResponseDTO[] | string>,
) {
  try {
    const eventId = req.params.eventId;
    const rules = Joi.object<{ eventId: string }>({
      eventId: validators.id().required(),
    });
    const formData = validate(res, rules, { eventId }, { allowUnknown: true });

    const eventDoc = await EventModel.findById(formData.eventId)
      .populate<{ team: ITeam }>('team')
      .populate<{ availability: IEventAvailability }>('availability');

    if (!eventDoc) {
      return returnError(Error('Event Not Found'), res, StatusCodes.NOT_FOUND);
    }

    // Find all the users
    let allUserIds: string[] = [];
    allUserIds.push(eventDoc.admin);
    if (eventDoc.team) {
      allUserIds.push(eventDoc.admin); // The admin of the event might not be the admin of the team
      eventDoc.team.members.map((m) => {
        allUserIds.push(m);
      });
    }

    // Filter to make unqiue
    allUserIds = [...new Set(allUserIds.map((s) => JSON.stringify(s)))].map(
      (s) => JSON.parse(s),
    );

    const userResponseDocs: UserResponseDTO[] = (
      await UserModel.find({ _id: { $in: allUserIds } })
    ).map((u) => {
      return {
        id: u._id,
        firstName: u.firstName,
        lastName: u.lastName,
        events: u.events,
      };
    });
    res.status(StatusCodes.OK).send(userResponseDocs);
  } catch (err) {
    returnError(err, res);
  }
}

// FInalize the final time that the event will take place at
export async function finalizeEventDate(req: Request, res: Response) {
  try {
    const eventId = req.params.eventId;

    // Validate payload
    const rules = Joi.object<FinalizeEventDateDTO & { eventId: string }>({
      eventId: validators.id().required(),
      startDate: validators.startDate().required(),
      endDate: validators.endDate().required(),
    });

    const formData = validate(
      res,
      rules,
      { ...req.body, eventId },
      { allowUnknown: true },
    );

    const eventDoc = await EventModel.findById(formData.eventId);

    // Check event exists
    if (!eventDoc) {
      return returnError(Error('Event Not Found'), res, StatusCodes.NOT_FOUND);
    }

    // Set finalized timebracket
    eventDoc.availability.finalisedTime = {
      startDate: formData.startDate,
      endDate: formData.endDate,
    };

    // Set finalized status
    eventDoc.status = EventStatus.Accepted;

    eventDoc.save(); // Persist event
    server.webSocket.send(`event:${eventId}`, eventDoc); // Emit event via websocket
    res.sendStatus(StatusCodes.OK);
  } catch (err) {
    returnError(err, res);
  }
}
