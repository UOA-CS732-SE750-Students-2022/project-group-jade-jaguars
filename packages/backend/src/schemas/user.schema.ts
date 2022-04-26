import { Model, model, Schema } from 'mongoose';

export interface IUser {
  firstName: string;
  lastName: string;
  _id: string;
  email?: string;
  events: String[];
}

const userSchema = new Schema<IUser>(
  {
    _id: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
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

export const UserModel: Model<IUser> = model<IUser>('User', userSchema);
