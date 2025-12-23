import mongoose from 'mongoose';

const DEFAULT_DB  = 'webpage-portfolio';
const mongoHost   = process.env.MONGO_HOST    || 'mongo';
const mongoPort   = process.env.MONGO_PORT    || '27017';
const mongoDbName = process.env.MONGO_DB_NAME || DEFAULT_DB;
const mongoUser   = process.env.MONGO_INITDB_ROOT_USERNAME;
const mongoPass   = process.env.MONGO_INITDB_ROOT_PASSWORD;
const mongoUrl    = process.env.MONGO_URL     || `mongodb://${mongoUser}:${mongoPass}@${mongoHost}:${mongoPort}/${mongoDbName}`;

export const connectDB = async (): Promise<void> => {
  const maxAttempts = process.env.DB_CONNECT_MAX_ATTEMPTS ? 
    parseInt(process.env.DB_CONNECT_MAX_ATTEMPTS, 10) : 0; // 0 = unlimited
  const retryDelay = process.env.DB_CONNECT_RETRY_DELAY_MS ? 
    parseInt(process.env.DB_CONNECT_RETRY_DELAY_MS, 10) : 3000;

  let attempt = 0;
  while (true) {
    attempt++;
    try {
      await mongoose.connect(mongoUrl);
      console.log(`Connected to MongoDB: ${mongoUrl} (attempt ${attempt})`);
      break;
    } catch (error: any) {
      console.error(`MongoDB connection attempt ${attempt} failed:`, error.message || error);
      if (maxAttempts > 0 && attempt >= maxAttempts) {
        console.error('Max MongoDB connection attempts reached, exiting.');
        process.exit(1);
      }
      console.log(`Retrying in ${retryDelay}ms...`);
      await new Promise((res) => setTimeout(res, retryDelay));
    }
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (error: any) {
    console.error('Error disconnecting MongoDB:', error);
  }
};
