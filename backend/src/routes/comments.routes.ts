import { Router } from "express";
import { authenticate, validateUserId } from "../middleware/auth.middleware";
import CommentController from "../controllers/comments.controller";

const router = Router();

router.get(   "/:postId",     CommentController.getAllComments);
router.get(   "/:postId/:id", CommentController.getCommentById);
router.post(  "/:postId",     authenticate, CommentController.createComment);
router.patch( "/:postId/:id", authenticate, validateUserId, CommentController.patchCommentById);
router.delete("/:postId/:id", authenticate, validateUserId, CommentController.deleteCommentById);

export default router;