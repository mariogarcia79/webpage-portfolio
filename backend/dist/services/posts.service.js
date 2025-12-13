"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Post_1 = __importDefault(require("../models/Post"));
const validation_1 = require("../utils/validation");
class PostService {
    static buildFilter(filter) {
        const mongoFilter = {};
        if (!filter)
            return mongoFilter;
        const allowedFields = [
            "author",
            "title",
            "summary",
            "content",
            "published"
        ];
        for (const key of allowedFields) {
            const value = filter[key];
            if (value == null)
                continue;
            if (key === "author") {
                if (typeof value === "string" && (0, validation_1.isObjectId)(value)) {
                    mongoFilter.author = new mongoose_1.Types.ObjectId(value);
                }
                else if (value instanceof mongoose_1.Types.ObjectId) {
                    mongoFilter.author = value;
                }
                continue;
            }
            if (typeof value === "boolean") {
                mongoFilter[key] = value;
                continue;
            }
            if (typeof value === "string") {
                const safeStr = (0, validation_1.sanitizeMongoInput)((0, validation_1.sanitizeText)(value));
                mongoFilter[key] = new RegExp((0, validation_1.escapeRegex)(safeStr), "i");
                continue;
            }
            if (value instanceof RegExp) {
                mongoFilter[key] = value;
            }
        }
        return mongoFilter;
    }
    static async getAllPosts({ sorted = true, filter }) {
        const mongoFilter = this.buildFilter(filter);
        if (mongoFilter.published == null)
            mongoFilter.published = true;
        const sortOrder = {
            createdAt: sorted ? "desc" : "asc"
        };
        return Post_1.default.find(mongoFilter).sort(sortOrder);
    }
    static async getPostById(id) {
        if (!(0, validation_1.isObjectId)(id))
            return null;
        try {
            return await Post_1.default.findById(id);
        }
        catch (err) {
            console.error("Error: getPostById:", err);
            return null;
        }
    }
    static async patchPostById(id, partial) {
        if (!(0, validation_1.isObjectId)(id))
            return null;
        const updateData = {};
        if (partial.title !== undefined)
            updateData.title = (0, validation_1.sanitizeText)(partial.title);
        if (partial.summary !== undefined)
            updateData.summary = (0, validation_1.sanitizeText)(partial.summary);
        if (partial.content !== undefined)
            updateData.content = (0, validation_1.sanitizeMarkdown)(partial.content);
        if (partial.published !== undefined)
            updateData.published = partial.published;
        try {
            return await Post_1.default.findByIdAndUpdate(id, updateData, { new: true });
        }
        catch (err) {
            console.error("Error: patchPostById:", err);
            return null;
        }
    }
    static async createPost(data) {
        if (!data.author || !(0, validation_1.isObjectId)(String(data.author))) {
            console.error("Error: createPost: invalid author");
            return null;
        }
        try {
            const newPost = new Post_1.default({
                author: data.author,
                title: (0, validation_1.sanitizeText)(data.title),
                summary: (0, validation_1.sanitizeText)(data.summary),
                content: (0, validation_1.sanitizeMarkdown)(data.content),
                published: data.published ?? true
            });
            return await newPost.save();
        }
        catch (err) {
            console.error("Error: createPost:", err);
            return null;
        }
    }
    static async deletePostById(id) {
        if (!(0, validation_1.isObjectId)(id))
            return false;
        try {
            const result = await Post_1.default.updateOne({ _id: id }, { published: false });
            return result.modifiedCount > 0;
        }
        catch (err) {
            console.error("Error: deletePostById:", err);
            return false;
        }
    }
}
exports.default = PostService;
