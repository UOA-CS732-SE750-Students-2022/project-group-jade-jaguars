import { Model, model, Types, Schema } from 'mongoose';

export interface IUser {
  firstName: string;
  lastName: string;
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
});

export const UserModel: Model<IUser> = model<IUser>('User', userSchema);
