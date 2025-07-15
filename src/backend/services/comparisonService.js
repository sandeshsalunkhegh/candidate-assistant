const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

function buildComparisonPrompt({ resumeData, jdAnalysis, jobTitle, industry, seniority }) {
  let context = '';
  if (jobTitle) context += `\nJob Title: ${jobTitle}`;
  if (industry) context += `\nIndustry: ${industry}`;
  if (seniority) context += `\nSeniority Level: ${seniority}`;

  // Few-shot example
  const example = `\nExample:\nResume Data: {\"Skills\":[\"React\",\"Node.js\"],\"Experiences\":[{\"company\":\"TechCorp\",\"title\":\"Engineer\",\"location\":\"Remote\",\"description\":\"Built apps.\"}],\"Projects\":[{\"name\":\"App\",\"technologies\":\"React\",\"description\":\"A web app.\"}]}\nJob Description Analysis: {\"requiredSkills\":[\"React\"],\"necessaryRequirements\":[\"2+ years experience\"],\"preferredRequirements\":[\"AWS\"]}\nResumeJDComparison : {\n  Suggestions : [\"Add AWS experience to resume.\"],\n  AnalysisDetails : {\n    MatchPercentage : 80,\n    Reasoning : [\"React skill matches.\", \"Missing AWS.\"],\n    UnmatchedPreferredKeywords : [\"AWS\"],\n    UnmatchedRequiredKeywords : [],\n    MatchedRequiredKeywords : [\"React\"],\n    MatchedPreferredKeywords : [],\n    ConfidenceScores: {\n      requiredSkills: {\"React\": 0.95},\n      necessaryRequirements: {\"2+ years experience\": 0.8},\n      preferredRequirements: {\"AWS\": 0.2}\n    }\n  }\n}`;

  return `Based on the following extracted information from a resume and the analysis of a job description, determine the percentage match between the resume and the job description.\n\n- Use weighted matching: required skills/requirements are 3x more important, necessary are 2x, preferred are 1x.\n- Use semantic similarity, not just exact string matches.\n- For each matched skill/requirement, provide a confidence score between 0 and 1.\n- In the output JSON, include a ConfidenceScores object for each category (requiredSkills, necessaryRequirements, preferredRequirements) with the matched item as the key and the confidence as the value.\n- Please skip any matches related to education background.\n- Please do the comparison on the basis of ATS score generation and give me a list of suggestions to improve the resume.\n- Please give all of the suggestions in the form of a JSON object that has following format:\nResumeJDComparison : {\n    Suggestions : [list of suggestions to improve the resume],\n    AnalysisDetails : {\n        MatchPercentage : [number],\n        Reasoning : [list of strings explaining the reasoning behind the match percentage]\n        UnmatchedPreferredKeywords : [list of preferred keywords that were expected in resume but are not present],\n        UnmatchedRequiredKeywords : [list of preferred keywords that were expected in resume but are not present],\n        MatchedRequiredKeywords : [list of preferred keywords that were present in resume],\n        MatchedPreferredKeywords : [list of preferred keywords that were present in resume],\n        ConfidenceScores: {\n          requiredSkills: { [matched required skill]: confidence },\n          necessaryRequirements: { [matched necessary requirement]: confidence },\n          preferredRequirements: { [matched preferred requirement]: confidence }\n        }\n    }\n}${context}${example}\nResume Data:\n${JSON.stringify(resumeData)}\nJob Description Analysis:\n${JSON.stringify(jdAnalysis)}\nProvide the match percentage as a single number (e.g., 75).`;
}

function normalizeStringArray(arr) {
  if (!Array.isArray(arr)) return [];
  return [...new Set(arr.map(s => typeof s === 'string' ? s.trim().toLowerCase() : ''))].filter(Boolean);
}

function validateComparison(data) {
  // Defensive: handle both direct and nested ResumeJDComparison
  const cmp = data.ResumeJDComparison || data;
  return {
    Suggestions: Array.isArray(cmp.Suggestions) ? cmp.Suggestions.map(s => s && String(s).trim()) : [],
    AnalysisDetails: {
      MatchPercentage: typeof cmp.AnalysisDetails?.MatchPercentage === 'number' ? cmp.AnalysisDetails.MatchPercentage : 0,
      Reasoning: normalizeStringArray(cmp.AnalysisDetails?.Reasoning),
      UnmatchedPreferredKeywords: normalizeStringArray(cmp.AnalysisDetails?.UnmatchedPreferredKeywords),
      UnmatchedRequiredKeywords: normalizeStringArray(cmp.AnalysisDetails?.UnmatchedRequiredKeywords),
      MatchedRequiredKeywords: normalizeStringArray(cmp.AnalysisDetails?.MatchedRequiredKeywords),
      MatchedPreferredKeywords: normalizeStringArray(cmp.AnalysisDetails?.MatchedPreferredKeywords),
    }
  };
}

async function analyzeComparisonWithGemini({ resumeData, jdAnalysis, jobTitle, industry, seniority }) {
  const prompt = buildComparisonPrompt({ resumeData, jdAnalysis, jobTitle, industry, seniority });
  const result = await model.generateContent(prompt);
  const responseText = result.response?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (responseText) {
    let parsed;
    if(typeof responseText == "string" && responseText.startsWith("```json") && responseText.endsWith("```")) {
      parsed = JSON.parse(responseText.substring(8, responseText.length - 3));
    } else if (typeof responseText == "object" && responseText.hasOwnProperty("ResumeJDComparison")) {
      parsed = responseText.ResumeJDComparison;
    } else {
      parsed = responseText;
    }
    return { ResumeJDComparison: validateComparison(parsed) };
  } else {
    throw new Error('Failed to get a valid match percentage from Gemini.');
  }
}

module.exports = {
  buildComparisonPrompt,
  validateComparison,
  analyzeComparisonWithGemini,
}; 