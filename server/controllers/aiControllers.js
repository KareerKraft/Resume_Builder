import Resume from "../models/Resume.js";
import ai from "../configs/ai.js";
import pdfParse from 'pdf-parse';
//controllers for enchancing a resume professional summary
//POST: /api/ai/enhance-pro-sum

export const enhanceProfessionalSummary = async(req,res) =>{
    try {
        const { userContent } =req.body;

        if(!userContent){
            return res.status(400).json({message: "Missing required fields"})
        }

        const response = await ai.chat.completions.create({
            model: process.env.OPEN_AI_MODEL,
            messages: [
                { role: "system", content: "You are an expert in resume writing.Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentences also highlighting key skills, experience, and career objectives. Make it compelling and ATS-friendly. and only return text no options or anything else." },
{
                    role:"user",
                    content:userContent,
                }],
           
    
        })
        const enhancedContent = response.choices[0].message.content;
        return res.status(200).json({enhancedContent})
    } catch (error) {
        return res.status(400).json({message:error.message})
    }
}

//controller for enhancing resume's job description
//POST: /api/ai/enhance-job-description

export const enhanceJobDescription = async(req,res) =>{
    try {
        const { userContent } =req.body;

        if(!userContent){
            return res.status(400).json({message: "Missing required fields"})
        }

        const response = await ai.chat.completions.create({
            model: process.env.OPEN_AI_MODEL,
            messages: [
                { role: "system", content:"You are an expert in resume writing. Your task is to enhance the job description of a resume. The job description should be only in 1-2 sentence also highlighting key responsibilities and achievements. Use action verbs and quantifiable results where possible. Make it ATS-friendly. and anything else." },
                {
                    role:"user",
                    content:userContent,
                }],
           
    
        })
        const enhancedContent = response.choices[0].message.content;
        return res.status(200).json({enhancedContent})
    } catch (error) {
        return res.status(400).json({message:error.message})
    }
}

//controller  for uploading resume to the database
//POST: /api/ai/upload-resume

export const UpdateResume = async(req,res) =>{

    try {
        const {resumeText , title}= req.body;
        const userId = req.userId;

        // If client uploaded a file, parse it server-side
        let extractedText = resumeText;
        if(req.file){
            const data = await pdfParse(req.file.buffer);
            extractedText = data?.text || "";
        }

        if(!extractedText){
            return res.status(400).json({message:"Missing required fields"})
        }
        const systemPrompt = "You are an expert AI Agent to extract data from resume."

        const userPrompt = `extract data from this resume: ${extractedText}
        
        Provide data in the following JSON format with no additional text before or after:
        {
        "professional_summary": "",
        "skills": [],
        "personal_info": {
            "image": "",
            "full_name": "",
            "profession": "",
            "email": "",
            "phone": "",
            "location": "",
            "linkedin": "",
            "website": ""
        },
        "experience": [],
        "project": [],
        "education": []
        }
        `
        

        const response = await ai.chat.completions.create({
            model: process.env.OPEN_AI_MODEL,
            messages: [
                { role: "system", 
                    content:systemPrompt },
                {
                    role:"user",
                    content:userPrompt,
                }],
                response_format:{type: 'json_object'}
           
    
        })
        const enhancedContent = response.choices[0].message.content;
        const parsedData = JSON.parse(enhancedContent || "{}")

        const newResume = await Resume.create({userId,title, ...parsedData})
        res.json({resumeId: newResume._id})
    } catch (error) {
        return res.status(400).json({message:error.message})
    }
}
