import { connectDB, disconnectDB } from './config/db';
import dotenv from "dotenv";
import app from "./app.js";
dotenv.config();

const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});

process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});