import mongoose from "mongoose"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";

export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Logic for user sign-up
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new Error("User already exists");
            error.status = 409; // Conflict`
            throw error;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create([{
            name,
            email,
            password: hashedPassword
        }], { session });

        const token = jwt.sign({ userId: newUser[0]._id },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        )

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        // Respond with success
        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: newUser[0],
            token
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

export const signIn = async (req, res, next) => { }

export const signOut = async (req, res, next) => { }