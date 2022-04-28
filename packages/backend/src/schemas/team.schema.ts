import { Model, model, Schema, Types } from 'mongoose';
import { identifier } from '../service/event.service';
import { randomEnum } from '..//libs/utils.lib';
import mongoose from 'mongoose';
import { randomUUID } from 'crypto';

// TODO: Replace this with a appropriate library or expand to whatever we need
export enum Colour {
  RED = 'red',
  BLUE = 'blue',
}

export interface ITeam {
  _id: string; // uuid
  title: string;
  description?: string;
  color?: Colour;
  admin: string; // uuid
  members?: string[]; //uuids
  events?: string[]; // uuids
}

const teamSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
      default: randomUUID(),
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      default: 'description',
    },
    color: {
      type: String,
      enum: Colour,
      required: true,
      default: randomEnum(Colour),
    },
    admin: {
      type: String,
      ref: 'User',
      required: true,
    },
    members: {
      type: [String],
      ref: 'User',
      required: true,
      default: [],
    },
    events: {
      type: [String],
      ref: 'Event',
      required: true,
      default: [],
    },
  },
  { timestamps: true },
);

export const TeamModel: Model<ITeam> = model<ITeam>('Team', teamSchema);
