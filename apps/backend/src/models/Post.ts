import { Schema, model, Document, Model } from 'mongoose';
import { IPost } from '../types/post';

export interface IPostDocument extends IPost, Document {}
export interface IPostModel extends Model<IPostDocument> {}

const postSchema = new Schema<IPostDocument>(
  {
    author:     { type: Schema.Types.ObjectId, ref: "User", required: true },
    title:      { type: String,   required: true },
    summary:    { type: String,   required: true },
    content:    { type: String,   required: true },
    published:  { type: Boolean,  required: true }
  },
  { 
    timestamps: true
  }
);

const Post = model<IPostDocument, IPostModel>('Post', postSchema);

export default Post;