import mongoose from 'mongoose'

const petAdoptionData = new mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
    age: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        default: undefined
    },
    imagePath: {
        type: String,
        required: true
    },
    vaccinationStatus: {
        type: Boolean,
        default: false
    },
    adoptionStatus: {
        type: String,
        enum: ['Available', 'Adopted'],
        default: 'Available'
    },
}, {
    timestamps: true
})
const petAdoptionModel = mongoose.model('PetAdoption', petAdoptionData, 'petsForAdoption')
export default petAdoptionModel