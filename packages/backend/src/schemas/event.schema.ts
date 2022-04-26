import { Model, model, Schema } from 'mongoose';
import { identifier } from '../service/models.service';

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
  attendee: string;
  availability: IAvailabilityBlock[];
  confirmed: Boolean;
}

export interface IEventAvailability {
  potentialTimes: ITimeBracket[];
  finalisedTime?: ITimeBracket;
  attendeeAvailability: IAttendeeAvailability[];
}

export interface IEvent {
  _id: string;
  title: string;
  description?: string;
  status: EventStatus;
  startDate: Date;
  endDate: Date;
  availability: IEventAvailability;
  location?: string;
  identifier: string;
  team?: string;
}

const eventSchema = new Schema<IEvent>(
  {
    _id: {
      type: String,
      required: true,
    },
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
                type: Schema.Types.String,
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
    description: {
      type: String,
      required: false,
    },
    location: {
      type: String,
      required: false,
    },
    identifier: {
      type: String,
      required: true,
      default: identifier(10),
    },
    team: {
      type: String,
      required: false,
      ref: 'Team',
    },
  },
  { timestamps: true },
);

export const EventModel: Model<IEvent> = model<IEvent>('Event', eventSchema);
