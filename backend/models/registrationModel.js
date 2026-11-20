import mongoose from 'mongoose';
const registrationSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        trim:true
    },
    email: {
        type: String,
        required: true,
        unique:true,
        trim:true,
        lowercase:true
    },
    password: {
        type: String,
        required: true
    },
    registeredAt: {
        type: Date,
        default: Date.now
    }

})
const userRegistrationModel = mongoose.model('user', registrationSchema)
export default userRegistrationModel