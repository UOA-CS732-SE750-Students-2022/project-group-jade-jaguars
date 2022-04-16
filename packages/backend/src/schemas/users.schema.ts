import { Model, model, Document, Types, Schema } from 'mongoose';
export interface IUser {
  firstName: string;
  lastName: string;
  events: Types.ObjectId[];
  // TODO: Add this in when we have teams setup
  // teams: Types.ObjectId[];
}

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  events: {
    type: [Types.ObjectId],
    ref: 'Event',
    required: true,
    default: [],
  },
});

export const UserModel: Model<IUser> = model<IUser>('User', userSchema);
