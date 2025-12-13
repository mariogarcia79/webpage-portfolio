import { Types } from "mongoose";
import CommentModel from "../models/Comment";
import { isObjectId, escapeRegex, sanitizeMongoInput, sanitizeText } from "../utils/validation";
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
                if (typeof value === "string" && isObjectId(value)) {
                    mongoFilter.author = new Types.ObjectId(value);
                }
                else if (value instanceof Types.ObjectId) {
                    mongoFilter.author = value;
                }
                continue;
            }
            if (key === "post") {
                if (typeof value === "string" && isObjectId(value)) {
                    mongoFilter.post = new Types.ObjectId(value);
                }
                else if (value instanceof Types.ObjectId) {
                    mongoFilter.post = value;
                }
                continue;
            }
            if (typeof value === "boolean") {
                mongoFilter[key] = value;
                continue;
            }
            if (typeof value === "string") {
                const safeStr = sanitizeMongoInput(sanitizeText(value));
                mongoFilter[key] = new RegExp(escapeRegex(safeStr), "i");
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
        return CommentModel.find(mongoFilter)
            .sort(sortOrder)
            .populate("author", "name");
    }
    static async getCommentById(id) {
        if (!isObjectId(id))
            return null;
        try {
            return CommentModel.findById(id)
                .populate("author", "name");
        }
        catch (err) {
            console.error("Error: getCommentById:", err);
            return null;
        }
    }
    static async patchCommentById(id, partial) {
        if (!isObjectId(id))
            return null;
        const updateData = {};
        if (partial.content !== undefined) {
            updateData.content = sanitizeMongoInput(sanitizeText(partial.content));
        }
        if (partial.published !== undefined) {
            updateData.published = partial.published;
        }
        try {
            return CommentModel.findByIdAndUpdate(id, updateData, {
                new: true
            }).populate("author", "name");
        }
        catch (err) {
            console.error("Error: patchCommentById:", err);
            return null;
        }
    }
    static async createComment(data) {
        if (!data.author || !isObjectId(String(data.author))) {
            console.error("Error: createComment: invalid author");
            return null;
        }
        try {
            const newComment = new CommentModel({
                author: data.author,
                post: data.post,
                content: sanitizeMongoInput(sanitizeText(data.content)),
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
        if (!isObjectId(id))
            return false;
        try {
            const result = await CommentModel.updateOne({ _id: id }, { published: false });
            return result.modifiedCount > 0;
        }
        catch (err) {
            console.error("Error: deleteCommentById:", err);
            return false;
        }
    }
}
export default CommentService;
