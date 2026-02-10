import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { enhanceProfessionalSummary, enhanceJobDescription, UpdateResume } from "../controllers/aiControllers.js";



const aiRouter = express.Router();

aiRouter.post('/enhance-pro-sum',protect,enhanceProfessionalSummary)
aiRouter.post('/enhance-job-desc',protect,enhanceJobDescription)
aiRouter.post('/upload-resume',protect, UpdateResume)

export default aiRouter
