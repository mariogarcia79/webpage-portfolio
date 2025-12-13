import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import routes from "./routes/index";

const app = express();

// Trust the first proxy (nginx) so req.protocol, secure, and IP forwarding work.
app.set('trust proxy', 1);

app.use(express.json());

// Configure Content Security Policy. In development we allow Vite dev server
// to use eval/inline for HMR; in production we lock down to safer defaults.
const isDev = process.env.NODE_ENV !== "production";

const scriptSrc = ["'self'"];
const styleSrc = ["'self'"];
const connectSrc = ["'self'"];

// Tighten CSP: do NOT allow 'unsafe-eval' or 'unsafe-inline'. Keep localhost origin allowances
// for development (so Vite assets can be loaded), but avoid unsafe keywords.
if (isDev) {
  scriptSrc.push("http://localhost:5173");
  styleSrc.push("http://localhost:5173");
  connectSrc.push("http://localhost:5173", "ws://localhost:5173");
} else {
  // In production, prefer only same-origin; adjust as needed for CDNs
  scriptSrc.push("'self'");
  styleSrc.push("'self'");
  connectSrc.push("'self'");
}

app.use(
  helmet({
    // Keep default helmet protections and add CSP below
  })
);

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc,
      styleSrc,
      connectSrc,
      imgSrc: ["'self'", 'data:', 'https:'],
      fontSrc: ["'self'", 'data:'],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      frameAncestors: ["'none'"],
      // Report CSP violations to backend route mounted under /api
      reportUri: ["/api/csp-report"],
    },
  })
);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/api", routes);

export default app;