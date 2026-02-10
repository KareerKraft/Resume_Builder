import OpenAI from "openai";

const ai = new OpenAI({
    apiKey: process.env.Open_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
});

export default ai