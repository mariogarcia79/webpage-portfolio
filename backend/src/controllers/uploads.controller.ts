import { Request, Response } from "express";
import { isObjectId } from "../utils/validation";
import { sendError } from "../config/errors";

class UploadController {
  
  static async uploadFile(req: Request, res: Response): Promise<Response> {
    
    if (!req.file) {
      return sendError(res, 'UPLOAD_ERROR');
    }
    
    const uploadUrl = `/uploads/${req.file.filename}`;
    console.log("Upload URL:", uploadUrl);
    
    return res
      .status(201)
      .json(uploadUrl);
  }
  
  static async deleteUpload(req: Request, res: Response): Promise<Response> {
    const id = req.params.uploadUrl;
    
    if (!isObjectId(id)) {
      return sendError(res, 'INVALID_INPUT');
    }

    return res
      .status(204)
      .send();
  }
}

export default UploadController;
