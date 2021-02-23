import { Comment, CommentSchema } from './comment.schema';
import { model, Model } from 'mongoose';

export const Comments: Model<Comment> = model<Comment>('Comment', CommentSchema);