import { Model, model, Types, Schema } from 'mongoose';

export interface IUser {
  firstName: string;
  lastName: string;
  _id: string;
  email?: string;
  events: Types.ObjectId[];
}

const userSchema = new Schema<IUser>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  events: {
    type: [Schema.Types.ObjectId],
    ref: 'Event',
    required: true,
    default: [],
  },
  email: {
    type: String,
    required: false,
  },
  _id: {
    type: String,
    required: true,
  },
});

export const UserModel: Model<IUser> = model<IUser>('User', userSchema);
