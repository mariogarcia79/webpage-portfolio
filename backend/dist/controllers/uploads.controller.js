"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validation_1 = require("../utils/validation");
class UploadController {
    static async uploadFile(req, res) {
        if (!req.file) {
            return res
                .status(400)
                .json({ error: "No file uploaded" });
        }
        const uploadUrl = `/uploads/${req.file.filename}`;
        console.log("Upload URL:", uploadUrl);
        return res
            .status(201)
            .json(uploadUrl);
    }
    static async deleteUpload(req, res) {
        const id = req.params.uploadUrl;
        if (!(0, validation_1.isObjectId)(id)) {
            return res
                .status(400)
                .json({ error: "Invalid upload url" });
        }
        return res
            .status(204)
            .send();
    }
}
exports.default = UploadController;
