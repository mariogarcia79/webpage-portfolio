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
    try {
        await mongoose_1.default.connect(mongoUrl);
        console.log(`Connected to MongoDB: ${mongoUrl}`);
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
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
