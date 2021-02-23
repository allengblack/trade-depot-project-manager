import { Document, Schema } from 'mongoose';

export interface User extends Document {
  email: string;
  phone: string;
  name: string;
  location: {
    type: string;
    coordinates: number[];
  };
  password_hash: string;
}

export interface UserDTO {
  email: string;
  phone: string;
  name: string;
  coordinates: number[];
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export const UserSchema: Schema = new Schema({
  email: { type: String, required: true },
  phone: { type: String, required: true },
  name: { type: String, required: true },
  password_hash: { type: String, required: true, select: false },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});

UserSchema.index({ email: 1 }, { unique: true });