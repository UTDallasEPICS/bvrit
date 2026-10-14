import mongoose from 'mongoose'
import connectDB from '../config/db'

const petAdoptionData = new mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
    age: {
        type: Number,
        required: true
    },
    imageURL: {
        type: String,
        required: true
    },
    vaccinationStatus: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
})
const petAdoptionModel = mongoose.model('pets', petAdoptionData)
export default petAdoptionModel