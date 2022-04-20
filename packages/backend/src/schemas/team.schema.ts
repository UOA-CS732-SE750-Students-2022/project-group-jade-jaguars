import { Model, model, Types, Schema } from 'mongoose';
import { randomEnum } from '..//libs/utils.lib';

// TODO: Replace this with a appropriate library or expand to whatever we need
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

/**
 * @swagger
 * components:
 *    schemas:
 *      Team:
 *        type: object
 *        required:
 *          - title
 *          - description
 *          - color
 *          - admin
 *          - members
 *          - events
 *        properties:
 *          id:
 *            type: integer
 *            description: The auto-generated id of the Event.
 *          title:
 *            type: string
 *            description: The title of the Event.
 *          color:
 *            type: string
 *            description: ENUM of the display color of the team.
 *          admin:
 *            type: uuid
 *            description: uuid of the admin user object.
 *          description:
 *            type: string
 *            description: short description of the Event.
 *          members:
 *            type: uuid[]
 *            description: a list of user object IDs that are members of the team.
 *          events:
 *            type: uuid[]
 *            description: a list of event object IDs that are scheduled for the team.
 *        example:
 *          id: "000000000000000000000000"
 *          title: "Front end team"
 *          description: "A team of developers"
 *          color: "red"
 *          admin: "990000000000000000000000"
 *          members: ["340000000000000000000000", "120000000000000000000000"]
 *          events: ["3300000000000000000000000", "334000000000000000000001"]
 */
