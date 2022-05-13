import { Model, model, Schema, Types } from 'mongoose';
import { randomEnum } from '../libs/utils.lib';
import { randomUUID } from 'crypto';

// TODO: Replace this with a appropriate library or expand to whatever we need
export enum Colour {
  RED = 'red',
  BLUE = 'blue',
}

export interface ITeam {
  _id: string; // id
  title: string;
  description?: string;
  color?: Colour;
  admin: string; // id
  members?: string[]; //ids
  events?: string[]; // ids
}

const teamSchema = new Schema(
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
    description: {
      type: String,
      required: false,
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
