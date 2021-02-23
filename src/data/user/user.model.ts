import { model, Model } from 'mongoose';
import { User, UserSchema } from './user.schema';

export const Users: Model<User> = model<User>('User', UserSchema);