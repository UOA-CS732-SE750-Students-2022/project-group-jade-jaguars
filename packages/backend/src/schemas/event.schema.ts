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
  startDate: Date;
  endDate: Date;
  availability: IEventAvailability;
  attendees: Types.ObjectId[];
  location: string;
  identifier: string;
  team: Types.ObjectId;
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
      default: EventStatus.Pending,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    availability: {
      type: {
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
              isAddedByAdmin: {
                type: Boolean,
                required: true,
                default: false,
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
          required: false,
          default: null,
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
                      required: true,
                    },
                    endDate: {
                      type: Date,
                      required: true,
                    },
                    status: {
                      type: String,
                      enum: Object.values(AvailabilityStatus),
                      required: true,
                      default: AvailabilityStatus.Available,
                    },
                  },
                ],
                required: true,
                default: [],
              },
              confirmed: {
                type: Boolean,
                required: true,
                default: false,
              },
            },
          ],
          required: true,
          default: [],
        },
      },
      required: true,
      default: {
        potentialTimes: [],
        attendeeAvailability: [],
        finalisedTime: null,
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
    team: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: 'Team',
    },
  },
  { timestamps: true },
);

// eventSchema.post('save', (doc, next) => {

//   next();
// });

export const EventModel: Model<IEvent> = model<IEvent>('Event', eventSchema);
