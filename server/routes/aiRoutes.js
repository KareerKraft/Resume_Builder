import express from "express";
import protect from "../middlewares/authMiddleware.js";
import upload from "../configs/multer.js";
import { enhanceProfessionalSummary, enhanceJobDescription, UpdateResume } from "../controllers/aiControllers.js";



const aiRouter = express.Router();

aiRouter.post('/enhance-pro-sum',protect,enhanceProfessionalSummary)
aiRouter.post('/enhance-job-desc',protect,enhanceJobDescription)
aiRouter.post('/upload-resume', protect, upload.single('resume'), UpdateResume)

export default aiRouter
