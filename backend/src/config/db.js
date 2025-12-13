import mongoose from 'mongoose';

const DEFAULT_DB = 'webpage-portfolio';
const mongoHost = process.env.MONGO_HOST || 'mongo';
const mongoPort = process.env.MONGO_PORT || '27017';
const mongoDbName = process.env.MONGO_DB_NAME || DEFAULT_DB;
const mongoUrl = process.env.MONGO_URL || `mongodb://${mongoHost}:${mongoPort}/${mongoDbName}`;

export const connectDB = async () => {
    try {
        await mongoose.connect(mongoUrl);
        console.log(`Connected to MongoDB: ${mongoUrl}`);
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};
export const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log('MongoDB disconnected');
    }
    catch (error) {
        console.error('Error disconnecting MongoDB:', error);
    }
};
