import { Model, model, Types, Schema } from 'mongoose';
import { randomEnum } from '..//libs/utils.lib';

// TODO: Replace this with a appropriate library
export enum Colour {
  RED,
  BLUE,
}

export interface ITeam {
  title: string;
  description?: string;
  color?: Colour;
  admin: Types.ObjectId;
  members?: Types.ObjectId[];
  events?: Types.ObjectId[];
}

const teamSchema = new Schema({
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
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: {
    type: [Types.ObjectId],
    ref: 'User',
    required: true,
    default: [],
  },
  events: {
    type: [Types.ObjectId],
    ref: 'Event',
    required: true,
    default: [],
  },
});

export const TeamModel: Model<ITeam> = model<ITeam>('Team', teamSchema);
