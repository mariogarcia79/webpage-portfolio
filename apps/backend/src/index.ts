import { connectDB, disconnectDB } from './config/db';
import { createDefaultAdmin } from './config/defaultUsers';
import dotenv from "dotenv";
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  // Create default admin user
  (async () => { await createDefaultAdmin(); })();

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});

process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});