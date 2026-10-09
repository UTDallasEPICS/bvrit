import bcrypt from "bcrypt";
import userRegistrationModel from "../models/registrationModel.js";

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }
        const user = await userRegistrationModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect password"
            });
        }
        req.session.user = {
            id: user._id,
            email: user.email
        };

        return res.status(200).json({
            success: true,
            message: "User logged in successfully"
        });

    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
