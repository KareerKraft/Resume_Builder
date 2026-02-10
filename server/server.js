import express from 'express';
import cors from 'cors';
import "dotenv/config";

import connectDB from './configs/db.js';
import userRouter from './routes/userRouter.js';
import resumeRouter from './routes/resumeRoutes.js';   // ✅ Proper import

const app = express();
const PORT = process.env.PORT || 3000;

console.log("MONGODB_URI =", process.env.MONGODB_URI);

// Database Connection
await connectDB();

// Middlewares
app.use(express.json());
app.use(cors());
app.use('/api/resumes',resumeRouter)

// Test Route
app.get('/', (req, res) => res.send("server is live..."));

// Routes
app.use('/api/users', userRouter);
app.use('/api/resumes', resumeRouter);

// Server Start
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
