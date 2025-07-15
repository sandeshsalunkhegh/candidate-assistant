const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

function buildJDPrompt({ jobDescription, jobTitle, industry, seniority }) {
  let context = '';
  if (jobTitle) context += `\nJob Title: ${jobTitle}`;
  if (industry) context += `\nIndustry: ${industry}`;
  if (seniority) context += `\nSeniority Level: ${seniority}`;

  // Few-shot example
  const example = `\nExample:\nJob Description:\nWe are looking for a Frontend Developer with experience in React and TypeScript.\nRequired Skills: [\"React\", \"TypeScript\"]\nNecessary Requirements: [\"3+ years experience\"]\nPreferred Requirements: [\"AWS\"]`;

  return `Analyze the following job description and extract the:\n- Required Skills\n- Necessary Requirements\n- Preferred Requirements\nProvide the output as a JSON object with keys \"requiredSkills\", \"necessaryRequirements\", and \"preferredRequirements\", where each key's value is a list of strings.${context}${example}\nJob Description:\n${jobDescription}`;
}

function normalizeStringArray(arr) {
  if (!Array.isArray(arr)) return [];
  return [...new Set(arr.map(s => typeof s === 'string' ? s.trim().toLowerCase() : ''))].filter(Boolean);
}

function validateJDAnalysis(data) {
  return {
    requiredSkills: normalizeStringArray(data.requiredSkills),
    necessaryRequirements: normalizeStringArray(data.necessaryRequirements),
    preferredRequirements: normalizeStringArray(data.preferredRequirements),
  };
}

async function analyzeJDWithGemini({ jobDescription, jobTitle, industry, seniority }) {
  const prompt = buildJDPrompt({ jobDescription, jobTitle, industry, seniority });
  const result = await model.generateContent(prompt);
  const responseText = result.response?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (responseText) {
    try {
      const cleanedResponse = responseText
        .replace(/```json/i, '')
        .replace(/```/g, '')
        .trim();
      const parsedResult = JSON.parse(cleanedResponse);
      return validateJDAnalysis(parsedResult);
    } catch (jsonError) {
      throw new Error('Failed to parse analysis result from Gemini.');
    }
  } else {
    throw new Error('Failed to get analysis from Gemini.');
  }
}

module.exports = {
  buildJDPrompt,
  validateJDAnalysis,
  analyzeJDWithGemini,
}; 