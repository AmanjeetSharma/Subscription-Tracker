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

        const isUserCreated = await User.findById(newUser[0]._id)
            .select("-password -token") // Exclude password and token from the response
            .session(session); // This is required inside the transaction


        // Commit the transaction
        await session.commitTransaction();

        console.log("✅  User created successfully");
        // Respond with success
        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: isUserCreated,
            token
        });

    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        session.endSession();
    }

}

export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // Find user by email
        const user = await User.find({ email });
        if (!user) {
            const error = new Error("User not found");
            error.status = 404; // Not Found
            throw error;
        }
        const isPasswordValid = await bcrypt.compare(password, user[0].password);
        if (!isPasswordValid) {
            const error = new Error("Invalid password");
            error.status = 401; // Unauthorized
            throw error;
        }

        const token = jwt.sign({ userId: user._id },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        const safeUser = await User.findById(user[0]._id)
            .select("-password");

        console.log(`✅  ${safeUser.name} signed in successfully`);
        res.status(200).json({
            success: true,
            message: "User signed in successfully",
            user: safeUser,
            token
        });

    } catch (error) {
        next(error);
    }
}

export const signOut = async (req, res, next) => {}