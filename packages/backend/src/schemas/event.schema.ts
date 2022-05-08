import { randomUUID } from 'crypto';
import { Model, model, Schema, Types } from 'mongoose';
import { calculatePotentialTimes, identifier } from '../service/models.service';

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
  _id: string;
  potentialTimes: ITimeBracket[]; // Virtual field
  finalisedTime?: ITimeBracket;
  attendeeAvailability: IAttendeeAvailability[];
}

const eventAvailabilitySchema = new Schema<IEventAvailability>({
  _id: {
    type: String,
    required: true,
    default: randomUUID(),
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
});

// eventAvailabilitySchema
//   .virtual('potentialTimes')
//   .get(async function (this: any) {
//     return await calculatePotentialTimes(this._id);
//   });

eventAvailabilitySchema.virtual('potentialTimes').get(function (this: any) {
  let potentialTimes: ITimeBracket[] = [];
  this.attendeeAvailability.forEach((a) => {
    a.availability.forEach((tb) => {
      potentialTimes.push({
        startDate: tb.startDate,
        endDate: tb.endDate,
      });
    });
  });
  return potentialTimes;
});

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
  team?: string; // id
  admin?: string; // id
}

const eventSchema = new Schema<IEvent>(
  {
    _id: {
      type: String,
      required: true,
      // This is cannot be shortened to randomUUID() otherwise entropy doesn't work
      default: () => {
        return randomUUID();
      },
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
    availability: eventAvailabilitySchema,
    description: {
      type: String,
      required: false,
    },
    location: {
      type: String,
      required: false,
    },
    team: {
      type: String,
      ref: 'Team',
      required: false,
    },
    // The admin can be anyone, the reason why this is required is that the team leader/admin might not be the one creating the event so we should explicity state who is the admin, admin takes the priority over team lead
    admin: {
      type: String,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

export const EventModel: Model<IEvent> = model<IEvent>('Event', eventSchema);
