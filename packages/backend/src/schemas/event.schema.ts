import mongoose from 'mongoose';
import { Model, model, Document, Types, Schema, SchemaType } from 'mongoose';

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
