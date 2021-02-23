import { Document, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface CommentDTO {
  message: string;
  product: string;
  reply_to?: string;
}

export interface Comment extends Document {
  message: string;
  user: string;
  product: string;
  reply_to: string;
}

export const CommentSchema: Schema = new Schema({
  _id: {
    type: String, default: function genUUID() {
      return uuidv4()
    }
  },
  message: { type: String, required: true },
  user: { type: String, required: true },
  product: { type: String, required: true },
  reply_to: { type: String, default: null },
});