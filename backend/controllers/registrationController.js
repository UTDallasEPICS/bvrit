import userRegistrationModel from "../models/registrationModel.js";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
    const { fname, email, password } = req.body;
    try {
        if (!fname || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await userRegistrationModel.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({
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
        console.error("Registration error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
