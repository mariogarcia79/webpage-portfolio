import { Schema, model, Document, Model } from "mongoose";
import { IComment } from "../types/comment";

export interface ICommentDocument extends IComment, Document {}
export interface ICommentModel extends Model<ICommentDocument> {}

const commentSchema = new Schema<ICommentDocument>(
  {
    post:     { type: Schema.Types.ObjectId, ref: "Post", required: true },
    author:   { type: Schema.Types.ObjectId, ref: "User", required: true },
    content:  { type: String, required: true },
    published:  { type: Boolean,  required: true }
  },
  {
    timestamps: true,
  }
);

const Comment = model<ICommentDocument, ICommentModel>('Comment', commentSchema);

export default Comment;