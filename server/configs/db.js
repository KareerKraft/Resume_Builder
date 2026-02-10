import mongoose from "mongoose";

const connectDB = async () => {
  try {

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connected successfully");

    let mongodbURI = process.env.MONGODB_URI;
    const projectName ="resume-builder";

    if(!mongodbURI){
        throw new Error("MONGODB_URI environment variable not set")
    }
    if(mongodbURI.endsWith("/")){
        mongodbURI = mongodbURI.slice(0, -1);
    }
   

    
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }

};

export default connectDB;
