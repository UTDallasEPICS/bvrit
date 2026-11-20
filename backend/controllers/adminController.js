import { unlink } from "node:fs/promises";
import mongoose from "mongoose";
import adoptionApplicationModel from "../models/adoptionApplicationModel.js";
import petAdoptionModel from "../models/petAdoptionModel.js";

const pendingApplicationFilter = [
  { status: "Pending" },
  { status: { $exists: false } },
];

const removeUploadedImage = async (filePath) => {
  try {
    await unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("Unable to remove unused pet image:", error);
    }
  }
};

export const getDashboardSummary = async (_req, res) => {
  try {
    const [totalPets, totalRequests, pendingRequests, approvedRequests] =
      await Promise.all([
        petAdoptionModel.countDocuments({ adoptionStatus: { $ne: "Adopted" } }),
        adoptionApplicationModel.countDocuments({}),
        adoptionApplicationModel.countDocuments({
          $or: pendingApplicationFilter,
        }),
        adoptionApplicationModel.countDocuments({ status: "Approved" }),
      ]);

    return res.status(200).json({
      success: true,
      data: { totalPets, totalRequests, pendingRequests, approvedRequests },
    });
  } catch (error) {
    console.error("Error loading admin dashboard summary:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load dashboard statistics.",
    });
  }
};

export const getAdminPets = async (_req, res) => {
  try {
    const pets = await petAdoptionModel.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: pets });
  } catch (error) {
    console.error("Error loading admin pets:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load pets.",
    });
  }
};

export const createPet = async (req, res) => {
  const { name, age, gender, vaccinationStatus } = req.body || {};
  const normalizedName = typeof name === "string" ? name.trim() : "";
  const normalizedAge = typeof age === "string" ? age.trim() : "";

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "A pet image is required.",
    });
  }

  if (
    !normalizedName ||
    !normalizedAge ||
    !["true", "false"].includes(vaccinationStatus) ||
    (gender && !["Male", "Female", "Other"].includes(gender))
  ) {
    await removeUploadedImage(req.file.path);
    return res.status(400).json({
      success: false,
      message: "Provide a name, age, valid gender, and vaccination status.",
    });
  }

  try {
    const pet = await petAdoptionModel.create({
      name: normalizedName,
      age: normalizedAge,
      ...(gender ? { gender } : {}),
      vaccinationStatus: vaccinationStatus === "true",
      imagePath: `/uploads/${req.file.filename}`,
      adoptionStatus: "Available",
    });

    return res.status(201).json({
      success: true,
      message: "Pet added successfully.",
      data: pet,
    });
  } catch (error) {
    await removeUploadedImage(req.file.path);
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid pet details.",
      });
    }

    console.error("Error creating pet:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to add pet.",
    });
  }
};

export const getAdoptionRequests = async (_req, res) => {
  try {
    const requests = await adoptionApplicationModel
      .find({})
      .populate("petId", "name age imagePath adoptionStatus")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: requests });
  } catch (error) {
    console.error("Error loading adoption requests:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load adoption requests.",
    });
  }
};

export const updateAdoptionRequestStatus = async (req, res) => {
  const { requestId } = req.params;
  const { status } = req.body || {};

  if (!mongoose.isValidObjectId(requestId)) {
    return res.status(400).json({
      success: false,
      message: "A valid adoption request is required.",
    });
  }

  if (!["Approved", "Rejected"].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Status must be Approved or Rejected.",
    });
  }

  try {
    const result = await mongoose.connection.transaction(async (session) => {
      const request = await adoptionApplicationModel.findOneAndUpdate(
        {
          _id: requestId,
          $or: pendingApplicationFilter,
        },
        { $set: { status, reviewedAt: new Date() } },
        { new: true, session }
      );

      if (!request) {
        return { conflict: "processed" };
      }

      if (status === "Approved") {
        const pet = await petAdoptionModel.findOneAndUpdate(
          {
            _id: request.petId,
            $or: [
              { adoptionStatus: "Available" },
              { adoptionStatus: { $exists: false } },
            ],
          },
          { $set: { adoptionStatus: "Adopted" } },
          { new: true, session }
        );

        if (!pet) {
          throw new Error("PET_UNAVAILABLE");
        }

        const otherRequests = await adoptionApplicationModel
          .find({
            petId: request.petId,
            _id: { $ne: request._id },
            $or: pendingApplicationFilter,
          })
          .select("_id")
          .session(session);

        await adoptionApplicationModel.updateMany(
          {
            petId: request.petId,
            _id: { $ne: request._id },
            $or: pendingApplicationFilter,
          },
          { $set: { status: "Rejected", reviewedAt: new Date() } },
          { session }
        );
        return {
          request,
          relatedRequestIds: otherRequests.map((item) => String(item._id)),
        };
      }

      return { request };
    });

    if (result.conflict) {
      return res.status(409).json({
        success: false,
        message: "This request has already been processed.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Adoption request ${status.toLowerCase()}.`,
      data: {
        _id: result.request._id,
        status,
        reviewedAt: result.request.reviewedAt,
        relatedRequestIds: result.relatedRequestIds || [],
      },
    });
  } catch (error) {
    if (error.message === "PET_UNAVAILABLE") {
      return res.status(409).json({
        success: false,
        message: "This pet is no longer available for adoption.",
      });
    }

    console.error("Error updating adoption request:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update adoption request.",
    });
  }
};
