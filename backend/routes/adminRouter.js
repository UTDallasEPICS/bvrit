import express from "express";
import {
  createPet,
  getAdminPets,
  getAdoptionRequests,
  getDashboardSummary,
  updateAdoptionRequestStatus,
} from "../controllers/adminController.js";
import { uploadPetImage } from "../middleware/petImageUpload.js";

const router = express.Router();

router.get("/dashboard", getDashboardSummary);
router.get("/pets", getAdminPets);
router.post("/pets", uploadPetImage, createPet);
router.get("/adoption-requests", getAdoptionRequests);
router.patch(
  "/adoption-requests/:requestId/status",
  updateAdoptionRequestStatus
);

export default router;
