import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import routes from "./routes/index";
import compression from "compression";

const app = express();

// Trust the first proxy (nginx) so req.protocol, secure, and IP forwarding work.
app.set('trust proxy', 1);

app.use(compression());

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

// Configure CORS with a dynamic allowlist. In production set CORS_ORIGINS to
// the exact origins you want to allow (comma-separated). In development we
// allow common localhost dev server ports (Vite preview/dev server variants).
const rawOrigins = process.env.CORS_ORIGINS;
const defaultDevOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
];
const allowlist = rawOrigins
  ? rawOrigins.split(',').map(s => s.trim()).filter(Boolean)
  : (isDev ? defaultDevOrigins : ["'self'"]);

app.use(
  cors({
    origin: function (incomingOrigin, callback) {
      // If no origin (same-origin request, curl, server-to-server), allow it
      if (!incomingOrigin) return callback(null, true);
      if (allowlist.includes(incomingOrigin)) return callback(null, true);
      const msg = `Origin ${incomingOrigin} not allowed by CORS`;
      return callback(new Error(msg), false);
    },
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/api", routes);

export default app;