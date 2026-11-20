import mongoose from "mongoose";
import adoptionApplicationModel from "../models/adoptionApplicationModel.js";
import petAdoptionModel from "../models/petAdoptionModel.js";

const requiredTextFields = [
  "fullName",
  "email",
  "phone",
  "occupation",
  "city",
  "state",
  "residenceType",
  "ownership",
  "hasExperience",
  "currentPets",
  "childrenAtHome",
  "reasonForAdoption",
  "dailyCareTime",
  "monthlyBudget",
];

export const submitApplication = async (req, res) => {
  const data = req.body || {};
  const { petId } = data;

  if (!mongoose.isValidObjectId(petId)) {
    return res.status(400).json({
      success: false,
      message: "A valid pet is required",
    });
  }

  const missingField = requiredTextFields.find(
    (field) => typeof data[field] !== "string" || !data[field].trim()
  );
  if (missingField) {
    return res.status(400).json({
      success: false,
      message: "Please complete all required application fields",
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address",
    });
  }

  if (
    !Number.isInteger(Number(data.age)) ||
    Number(data.age) < 1 ||
    Number(data.age) > 120 ||
    !Number.isInteger(Number(data.familyMembers)) ||
    Number(data.familyMembers) < 1
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid age and household size",
    });
  }

  if (data.agreeToTerms !== true) {
    return res.status(400).json({
      success: false,
      message: "Please agree to the application terms",
    });
  }

  try {
    const pet = await petAdoptionModel.findById(petId);
    if (!pet) {
      return res.status(404).json({
        success: false,
        message: "Pet not found",
      });
    }
    if (pet.adoptionStatus === "Adopted") {
      return res.status(409).json({
        success: false,
        message: "This pet is no longer available for adoption",
      });
    }

    const application = new adoptionApplicationModel({
      ...data,
      petId: pet._id,
      userId: req.session.user.id,
      age: Number(data.age),
      familyMembers: Number(data.familyMembers),
      petDetails: typeof data.petDetails === "string" ? data.petDetails : "",
    });
    await application.save();

    return res.status(201).json({
      success: true,
      message: "Adoption application submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting adoption application:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid application details",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to submit adoption application",
    });
  }
};
