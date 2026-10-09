import connectDB from "../config/db";
import mongoose from "mongoose";
import userRegistrationModel from "./registrationModel";
const userSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        unique: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },
    location: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },




})
const profile = mongoose.model('profiles', userSchema)
export default profile