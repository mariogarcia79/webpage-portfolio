"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    author: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    published: { type: Boolean, required: true }
}, {
    timestamps: true
});
const Post = (0, mongoose_1.model)('Post', postSchema);
exports.default = Post;
