import { Router }   from "express";
import authRoutes   from "./auth.routes";
import postsRoutes  from "./posts.routes";
import userRoutes   from "./users.routes";
import commentsRoutes from "./comments.routes";
import uploadsRoutes from "./uploads.routes";

const router = Router();

router.use( "/auth",  authRoutes);
router.use( "/posts", postsRoutes);
router.use( "/users", userRoutes);
router.use( "/comments", commentsRoutes);
router.use( "/uploads", uploadsRoutes);

// CSP report endpoint: browsers will POST violation reports here (application/csp-report or application/json)
router.post("/csp-report", (req, res) => {
	try {
		// Log the report for monitoring/inspection. Adjust to integrate with your logging system.
		console.warn("CSP Violation Report:", JSON.stringify(req.body));
	} catch (err) {
		console.warn("CSP report received but could not be logged", err);
	}
	// Return 204 No Content as recommended for report endpoints
	res.status(204).send();
});

export default router;