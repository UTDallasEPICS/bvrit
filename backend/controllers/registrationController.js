import userRegistrationModel from "../models/registrationModel.js";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
    const { fname, email, password } = req.body || {};
    try {
        if (
            typeof fname !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and password are required"
            });
        }

        const normalizedName = fname.trim();
        const normalizedEmail = email.trim().toLowerCase();

        if (!normalizedName) {
            return res.status(400).json({
                success: false,
                message: "Name is required"
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters"
            });
        }

        const existingUser = await userRegistrationModel.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userRegistrationModel({
            fname: fname.trim(),
            email: normalizedEmail,
            password: hashedPassword
        });

        await newUser.save();

        return res.status(201).json({
            success: true,
            message: "User registered successfully"
        });
    } catch (err) {
        if (err && err.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }
        console.error("Registration error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
