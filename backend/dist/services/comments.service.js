"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Comment_1 = __importDefault(require("../models/Comment"));
const validation_1 = require("../utils/validation");
class CommentService {
    static buildFilter(filter) {
        const mongoFilter = {};
        if (!filter)
            return mongoFilter;
        const allowedFields = [
            "post",
            "author",
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
            if (key === "post") {
                if (typeof value === "string" && (0, validation_1.isObjectId)(value)) {
                    mongoFilter.post = new mongoose_1.Types.ObjectId(value);
                }
                else if (value instanceof mongoose_1.Types.ObjectId) {
                    mongoFilter.post = value;
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
    static async getAllComments({ sorted = true, filter }) {
        const mongoFilter = this.buildFilter(filter);
        if (mongoFilter.published == null)
            mongoFilter.published = true;
        const sortOrder = {
            createdAt: sorted ? "desc" : "asc"
        };
        return Comment_1.default.find(mongoFilter)
            .sort(sortOrder)
            .populate("author", "name");
    }
    static async getCommentById(id) {
        if (!(0, validation_1.isObjectId)(id))
            return null;
        try {
            return Comment_1.default.findById(id)
                .populate("author", "name");
        }
        catch (err) {
            console.error("Error: getCommentById:", err);
            return null;
        }
    }
    static async patchCommentById(id, partial) {
        if (!(0, validation_1.isObjectId)(id))
            return null;
        const updateData = {};
        if (partial.content !== undefined) {
            updateData.content = (0, validation_1.sanitizeMongoInput)((0, validation_1.sanitizeText)(partial.content));
        }
        if (partial.published !== undefined) {
            updateData.published = partial.published;
        }
        try {
            return Comment_1.default.findByIdAndUpdate(id, updateData, {
                new: true
            }).populate("author", "name");
        }
        catch (err) {
            console.error("Error: patchCommentById:", err);
            return null;
        }
    }
    static async createComment(data) {
        if (!data.author || !(0, validation_1.isObjectId)(String(data.author))) {
            console.error("Error: createComment: invalid author");
            return null;
        }
        try {
            const newComment = new Comment_1.default({
                author: data.author,
                post: data.post,
                content: (0, validation_1.sanitizeMongoInput)((0, validation_1.sanitizeText)(data.content)),
                published: data.published ?? true
            });
            const saved = await newComment.save();
            return saved.populate("author", "name");
        }
        catch (err) {
            console.error("Error: createComment:", err);
            return null;
        }
    }
    static async deleteCommentById(id) {
        if (!(0, validation_1.isObjectId)(id))
            return false;
        try {
            const result = await Comment_1.default.updateOne({ _id: id }, { published: false });
            return result.modifiedCount > 0;
        }
        catch (err) {
            console.error("Error: deleteCommentById:", err);
            return false;
        }
    }
}
exports.default = CommentService;
