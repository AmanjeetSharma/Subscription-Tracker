import express from 'express';
import cookieParser from 'cookie-parser';
import { PORT } from './config/env.js';
import connectDB from './database/db.js';
import errorMiddleware from './middlewares/error.middleware.js';
import arcjetMiddleware from './middlewares/arcjet.middleware.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded data
app.use(cookieParser()); // Middleware to parse cookies
// app.use(arcjetMiddleware); // Middleware for Arcjet protection


// Importing routes

import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';

// Registering routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);

app.use(errorMiddleware); // Error handling middleware

app.get('/', (req, res) => {
    res.send('Welcome to the Subscription Tracker API');
})

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port: http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Failed to connect to the database:', error);
        process.exit(1); // Exit the process with failure
    });

export default app;