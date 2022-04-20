import { required } from 'joi';
import { Model, model, Types, Schema } from 'mongoose';
import { identifier } from '../models/models.module';

export enum EventStatus {
  Pending = 'Pending',
  Accepted = 'Accepted',
  Rejected = 'Rejected',
  Cancelled = 'Cancelled',
}

export interface ITimeBracket {
  startDate: Date;
  endDate: Date;
}

const timeBracketSchema = new Schema<ITimeBracket>({
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
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

export interface IAttendeeAvailability {
  attendee: Types.ObjectId;
  availability: IAvailabilityBlock[];
}

export interface IEventAvailability {
  potentialTimes: ITimeBracket[];
  finalisedTime?: ITimeBracket;
  attendeeAvailability: IAttendeeAvailability[];
}

export interface IEvent {
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

const eventSchema = new Schema<IEvent>(
  {
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
    availability: {
      potentialTimes: {
        type: [
          {
            startDate: {
              type: Date,
              required: true,
            },
            endDate: {
              type: Date,
              required: true,
            },
          },
        ],
      },
      finalisedTime: {
        type: {
          startDate: {
            type: Date,
            required: true,
          },
          endDate: {
            type: Date,
            required: true,
          },
        },
      },
      attendeeAvailability: {
        type: [
          {
            attendee: {
              type: Schema.Types.ObjectId,
              ref: 'User',
            },
            availability: {
              type: [
                {
                  startDate: {
                    type: Date,
                  },
                  endDate: {
                    type: Date,
                  },
                  status: {
                    type: String,
                    enum: Object.values(AvailabilityStatus),
                  },
                },
              ],
            },
          },
        ],
        required: true,
        default: [],
      },
    },
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
    identifier: {
      type: String,
      required: true,
      default: identifier(10),
    },
  },
  { timestamps: true },
);

export const EventModel: Model<IEvent> = model<IEvent>('Event', eventSchema);
