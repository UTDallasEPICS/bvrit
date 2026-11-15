import mongoose from "mongoose";

const yesNo = ["Yes", "No"];

const adoptionApplicationSchema = new mongoose.Schema(
  {
    petId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PetAdoption",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 1, max: 120 },
    occupation: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    residenceType: {
      type: String,
      enum: ["Apartment", "Independent House", "Shared Accommodation", "Other"],
      required: true,
    },
    ownership: { type: String, enum: ["Own", "Rent"], required: true },
    hasExperience: { type: String, enum: yesNo, required: true },
    currentPets: { type: String, enum: yesNo, required: true },
    petDetails: { type: String, trim: true, default: "" },
    familyMembers: { type: Number, required: true, min: 1 },
    childrenAtHome: { type: String, enum: yesNo, required: true },
    reasonForAdoption: { type: String, required: true, trim: true },
    dailyCareTime: {
      type: String,
      enum: ["Less than 1 hour", "1-3 hours", "3-5 hours", "More than 5 hours"],
      required: true,
    },
    monthlyBudget: { type: String, enum: yesNo, required: true },
    agreeToTerms: { type: Boolean, required: true, validate: (value) => value },
  },
  { timestamps: true }
);

const adoptionApplicationModel = mongoose.model(
  "AdoptionApplication",
  adoptionApplicationSchema
);

export default adoptionApplicationModel;
