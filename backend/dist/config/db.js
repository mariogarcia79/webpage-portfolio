"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDB = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const DEFAULT_DB = 'webpage-portfolio';
const mongoHost = process.env.MONGO_HOST || 'mongo';
const mongoPort = process.env.MONGO_PORT || '27017';
const mongoDbName = process.env.MONGO_DB_NAME || DEFAULT_DB;
const mongoUrl = process.env.MONGO_URL || `mongodb://${mongoHost}:${mongoPort}/${mongoDbName}`;
const connectDB = async () => {
    const maxAttempts = process.env.DB_CONNECT_MAX_ATTEMPTS ? parseInt(process.env.DB_CONNECT_MAX_ATTEMPTS, 10) : 0; // 0 = unlimited
    const retryDelay = process.env.DB_CONNECT_RETRY_DELAY_MS ? parseInt(process.env.DB_CONNECT_RETRY_DELAY_MS, 10) : 3000;
    let attempt = 0;
    while (true) {
        attempt++;
        try {
            await mongoose_1.default.connect(mongoUrl);
            console.log(`Connected to MongoDB: ${mongoUrl} (attempt ${attempt})`);
            break;
        }
        catch (error) {
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
exports.connectDB = connectDB;
const disconnectDB = async () => {
    try {
        await mongoose_1.default.disconnect();
        console.log('MongoDB disconnected');
    }
    catch (error) {
        console.error('Error disconnecting MongoDB:', error);
    }
};
exports.disconnectDB = disconnectDB;
