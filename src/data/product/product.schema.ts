import { Document, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface ProductDTO {
  name: string;
  coordinates: string;
}

export interface Product extends Document {
  name: string;
  user: string;
  location: {
    type: string,
    coordinates: number[]
  };
  image: string;
}

export const ProductSchema: Schema = new Schema({
  _id: {
    type: String, default: function genUUID() {
      return uuidv4()
    }
  },
  name: { type: String, required: true },
  user: { type: String, required: true },
  image: { type: String, required: true },
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