import express from "express";
import cookieParser from "cookie-parser";
import routes from "./routes/index";
import compression from "compression";

const app = express();

//app.set('trust proxy', 1);

app.use(compression());
app.use(express.json());
app.use(cookieParser());
app.use("/api", routes);

export default app;