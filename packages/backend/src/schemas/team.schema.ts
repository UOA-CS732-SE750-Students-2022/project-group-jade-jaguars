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

  _id: {
    type: String,
    required: true,
  },
const teamSchema = new Schema(
  {
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
  },
  { timestamps: true },
);

export const TeamModel: Model<ITeam> = model<ITeam>('Team', teamSchema);
