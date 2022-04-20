import { Model, model, Types, Schema } from 'mongoose';

export enum EventStatus {
  Pending = 'Pending',
  Accepted = 'Accepted',
  Rejected = 'Rejected',
  Cancelled = 'Cancelled',
}

export interface ITimeBracket {
  startTime: Date;
  endTime: Date;
}

const timeBracketSchema = new Schema<ITimeBracket>({
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
});

export enum AvailabilityStatus {
  Available = 'Available',
  Unavailable = 'Unavailable',
  Tentative = 'Tentative',
}

export interface IAvailabilityBlock extends ITimeBracket {
  status: AvailabilityStatus;
}

const availabilityBlockSchema = new Schema<IAvailabilityBlock>({
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(AvailabilityStatus),
    required: true,
  },
});

export interface IAttendeeAvailability {
  attendee: Types.ObjectId;
  availability: IAvailabilityBlock[];
}

const attendeeAvailabilitySchema = new Schema<IAttendeeAvailability>({
  attendee: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  availability: {
    type: [availabilityBlockSchema],
    required: true,
  },
});

export interface IEventAvailability {
  potentialTimes: ITimeBracket[];
  finalisedTime?: ITimeBracket;
  attendeeAvailability: IAttendeeAvailability[];
}

const eventAvailabilitySchema = new Schema<IEventAvailability>({
  potentialTimes: {
    type: [timeBracketSchema],
    required: true,
  },
  finalisedTime: {
    type: timeBracketSchema,
    required: false,
  },
  attendeeAvailability: {
    type: [attendeeAvailabilitySchema],
    required: true,
  },
});

export interface IEvent {
  title: string;
  description: string;
  status: EventStatus;
  startTime: number;
  endTime: number;
  availability: IEventAvailability;
  attendees: Types.ObjectId[];
  location: string;
}

const eventSchema = new Schema<IEvent>({
  title: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(EventStatus),
    required: true,
  },
  startTime: {
    type: Number,
    required: true,
  },
  endTime: {
    type: Number,
    required: true,
  },
  availability: eventAvailabilitySchema,
  attendees: {
    type: [Types.ObjectId],
    ref: 'User',
    required: true,
    default: [],
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
});

export const EventModel: Model<IEvent> = model<IEvent>('Event', eventSchema);

/**
 * @swagger
 * components:
 *    schemas:
 *      Event:
 *        type: object
 *        required:
 *          - title
 *          - status
 *          - finished
 *          - startTime
 *          - endTime
 *          - location
 *          - description
 *        properties:
 *          id:
 *            type: integer
 *            description: The auto-generated id of the Event.
 *          title:
 *            type: string
 *            description: The title of the Event.
 *          status:
 *            type: string
 *            description: ENUM - pending, accepted, rejected, cancelled
 *          startTime:
 *            type: number
 *            description: UNIX time stamp of the chosen start time.
 *          endTime:
 *            type: number
 *            description: UNIX time stamp of the chosen end time
 *          location:
 *            type: string
 *            description: Location of the event.
 *          description:
 *            type: string
 *            description: short description of the Event.
 *          attendees:
 *            type: uuid[]
 *            description: a list of user object IDs that are attending or invited to the event.
 *          availability:
 *            type: object
 *            $ref: '#/components/schemas/EventAvailability'
 *        example:
 *          id: "000000000000000000000000"
 *          title: "Dev Meeting"
 *          status: "Pending"
 *          startTime: 1588888888
 *          endTime: 1588888888
 *          location: "Room 1"
 *          description: "A meeting for developers"
 *          attendees: ["340000000000000000000000", "120000000000000000000000"]
 *          availability: "object"
 *
 *      EventAvailability:
 *        type: object
 *        required:
 *          - potentialTimes
 *          - attendeeAvailability
 *        properties:
 *          potentialTimes:
 *            type: object[]
 *            description: A list of potential times for the event.
 *            $ref: '#/components/schemas/TimeBracket'
 *          finalisedTime:
 *            type: object
 *            description: The finalised time for the event.
 *            $ref: '#/components/schemas/TimeBracket'
 *          attendeeAvailability:
 *            type: object[]
 *            description: A list of attendee availability for the event.
 *      TimeBracket:
 *        type: object
 *        required:
 *          - startTime
 *          - endTime
 *        properties:
 *          startTime:
 *            type: number
 *            description: UNIX time stamp of the start time.
 *          endTime:
 *            type: number
 *            description: UNIX time stamp of the end time
 *
 *
 *
 *
 */
