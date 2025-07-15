import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

export async function analyzeJobDescription({ jobDescription, jobTitle, industry }) {
  const response = await axios.post(`${apiUrl}/api/analyze-job-description`, {
    jobDescription,
    jobTitle,
    industry,
  });
  return response.data;
}

export async function compareResumeJD({ resumeData, jdAnalysis, jobTitle, industry }) {
  const response = await axios.post(`${apiUrl}/api/compare-resume-jd`, {
    resumeData,
    jdAnalysis,
    jobTitle,
    industry,
  });
  return response.data;
}

// Add more API functions as needed, e.g. for resume-JD comparison, resume upload, etc. 