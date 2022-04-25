import { Model, model, Types, Schema } from 'mongoose';
import { randomEnum } from '..//libs/utils.lib';

// TODO: Replace this with a appropriate library or expand to whatever we need
export enum Colour {
  RED = 'red',
  BLUE = 'blue',
}

export interface ITeam {
  _id: string;
  title: string;
  description?: string;
  color?: Colour;
  admin: string;
  members?: string[];
  events?: string[];
}

const teamSchema = new Schema({
  _id: {
    type: String,
    required: true,
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
});

export const TeamModel: Model<ITeam> = model<ITeam>('Team', teamSchema);
