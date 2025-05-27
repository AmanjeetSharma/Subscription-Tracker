import mongoose from 'mongoose';
import { DB_URI, NODE_ENV } from '../config/env.js';

if (!DB_URI) {
    throw new Error('Please define the DB_URI environment variable inside .env.<development/production>.local');
}

const connectDB = async () => {
    try {
        const connectInstance = await mongoose.connect(DB_URI);
        console.log(`MongoDB connected in ${NODE_ENV} mode!!! | HOST: ${connectInstance.connection.host}`);
    } catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1); // Exit the process with failure
    }
}
export default connectDB;