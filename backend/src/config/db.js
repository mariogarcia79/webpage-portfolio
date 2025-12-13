import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
let mongoServer;
export const connectDB = async () => {
    try {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);
        console.log(`Succesfully launched MongoDB: ${uri}`);
    }
    catch (error) {
        console.error('Error while launching MongoDB:', error);
        process.exit(1);
    }
};
export const disconnectDB = async () => {
    await mongoose.disconnect();
    if (mongoServer)
        await mongoServer.stop();
};
