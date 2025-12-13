import { Schema, model } from 'mongoose';
const postSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    published: { type: Boolean, required: true }
}, {
    timestamps: true
});
const Post = model('Post', postSchema);
export default Post;
