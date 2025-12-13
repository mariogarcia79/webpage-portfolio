"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const posts_routes_1 = __importDefault(require("./posts.routes"));
const users_routes_1 = __importDefault(require("./users.routes"));
const comments_routes_1 = __importDefault(require("./comments.routes"));
const uploads_routes_1 = __importDefault(require("./uploads.routes"));
const router = (0, express_1.Router)();
router.use("/auth", auth_routes_1.default);
router.use("/posts", posts_routes_1.default);
router.use("/users", users_routes_1.default);
router.use("/comments", comments_routes_1.default);
router.use("/uploads", uploads_routes_1.default);
// CSP report endpoint: browsers will POST violation reports here (application/csp-report or application/json)
router.post("/csp-report", (req, res) => {
    try {
        // Log the report for monitoring/inspection. Adjust to integrate with your logging system.
        console.warn("CSP Violation Report:", JSON.stringify(req.body));
    }
    catch (err) {
        console.warn("CSP report received but could not be logged", err);
    }
    // Return 204 No Content as recommended for report endpoints
    res.status(204).send();
});
exports.default = router;
