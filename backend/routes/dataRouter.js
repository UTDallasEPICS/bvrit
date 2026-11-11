import express from "express"
const router = express.Router()
import { getdata } from "../controllers/dataController.js"
router.get('/', getdata)
export default router;