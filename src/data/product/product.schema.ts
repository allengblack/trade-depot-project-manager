import { Document, Schema } from 'mongoose';

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