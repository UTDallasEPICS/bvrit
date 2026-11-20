import express from "express";
import { submitApplication } from "../controllers/adoptionController.js";

const router = express.Router();

router.post("/apply", submitApplication);

export default router;
