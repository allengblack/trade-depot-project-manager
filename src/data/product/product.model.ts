import { Model, model } from 'mongoose';
import { Product, ProductSchema } from './product.schema';

export const Products: Model<Product> = model<Product>('Product', ProductSchema);