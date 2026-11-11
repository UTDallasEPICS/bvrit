import mongoose from 'mongoose'
import connectDB from '../config/db.js'

const petAdoptionData = new mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
    age: {
        type: Number,
        required: true
    },
    imagePath: {
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
const petAdoptionModel = mongoose.model('PetAdoption', petAdoptionData, 'petsForAdoption')
export default petAdoptionModel