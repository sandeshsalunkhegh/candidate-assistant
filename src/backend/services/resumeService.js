const pdf = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

async function extractTextFromPdf(pdfBuffer) {
  try {
    const data = await pdf(pdfBuffer);
    return data.text;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    return null;
  }
}

function buildResumePrompt({ extractedText, jobTitle, industry, seniority }) {
  let context = '';
  if (jobTitle) context += `\nJob Title: ${jobTitle}`;
  if (industry) context += `\nIndustry: ${industry}`;
  if (seniority) context += `\nSeniority Level: ${seniority}`;

  // Few-shot example
  const example = `\nExample:\nText:\nJohn Doe is a Senior Software Engineer at TechCorp. He has experience in React, Node.js, and AWS.\nSkills:\n- React\n- Node.js\n- AWS\nExperiences:\n- {\"company\": \"TechCorp\", \"title\": \"Senior Software Engineer\", \"location\": \"Remote\", \"description\": \"Worked on cloud applications.\"}\nProjects:\n- {\"name\": \"CloudApp\", \"technologies\": \"React, AWS\", \"description\": \"A scalable cloud app.\"}`;

  return `From the following text, identify and categorize the \"Skills\", \"Experiences\", and \"Projects\". Provide the output in a structured format, and nothing extra, just the JSON object.${context}${example}\nText:\n${extractedText}\n\nSkills:\n- list of skills\nExperiences:\n- list of json objects, each with keys - \"company\",\"title\",\"location\",\"description\"\nProjects:\n- list or projects with keys - \"name\",\"technologies\",\"description\"\nIn case if any of the values are not present, please return an empty list for that key.`;
}

function normalizeStringArray(arr) {
  if (!Array.isArray(arr)) return [];
  return [...new Set(arr.map(s => typeof s === 'string' ? s.trim().toLowerCase() : ''))].filter(Boolean);
}

function validateResumeData(data) {
  return {
    Skills: normalizeStringArray(data.Skills),
    Experiences: Array.isArray(data.Experiences) ? data.Experiences.map(exp => ({
      company: exp.company ? String(exp.company).trim() : '',
      title: exp.title ? String(exp.title).trim() : '',
      location: exp.location ? String(exp.location).trim() : '',
      description: exp.description ? String(exp.description).trim() : '',
    })) : [],
    Projects: Array.isArray(data.Projects) ? data.Projects.map(proj => ({
      name: proj.name ? String(proj.name).trim() : '',
      technologies: proj.technologies ? String(proj.technologies).trim() : '',
      description: proj.description ? String(proj.description).trim() : '',
    })) : [],
  };
}

async function analyzeResumeWithGemini({ extractedText, jobTitle, industry, seniority }) {
  const prompt = buildResumePrompt({ extractedText, jobTitle, industry, seniority });
  const result = await model.generateContent(prompt);
  const geminiOutput = result.response?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (geminiOutput) {
    const jsonRegex = /\{[\s\S]*\}/;
    const match = geminiOutput.match(jsonRegex);
    if (match) {
      const extractedJson = match[0];
      try {
        const parsedData = JSON.parse(extractedJson);
        return validateResumeData(parsedData);
      } catch (error) {
        throw new Error('Failed to parse the analysis result from Gemini.');
      }
    } else {
      throw new Error('Failed to find structured data in Gemini response.');
    }
  } else {
    throw new Error('Failed to get a meaningful response from Gemini.');
  }
}

module.exports = {
  extractTextFromPdf,
  buildResumePrompt,
  validateResumeData,
  analyzeResumeWithGemini,
}; 