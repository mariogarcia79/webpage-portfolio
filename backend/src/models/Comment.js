import { Schema, model } from "mongoose";
const commentSchema = new Schema({
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    published: { type: Boolean, required: true }
}, {
    timestamps: true,
});
const Comment = model('Comment', commentSchema);
export default Comment;
