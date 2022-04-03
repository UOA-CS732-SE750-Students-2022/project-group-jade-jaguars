import mongoose from 'mongoose';
import { Model, model, Document, Types, Schema } from 'mongoose';

export enum EventStatus {
  Pending,
  Accepted,
  Rejected,
  Cancelled,
}

export interface IEvent {
  startTime: number;
  title: string;
  status: EventStatus;
  endTime: number;
  attendees: mongoose.Types.ObjectId[];
  description: string[];
  location: string;
}

const eventSchema = new Schema({
  startTime: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: EventStatus,
    required: true,
  },
  endTime: {
    type: Number,
    required: true,
  },
  attendees: {
    type: [mongoose.Types.ObjectId],
    ref: 'User',
    required: true,
  },
  description: {
    type: [String],
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
});

export const EventModel: Model<IEvent> = model<IEvent>('Event', eventSchema);
