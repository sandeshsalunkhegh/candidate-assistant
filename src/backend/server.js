require('dotenv').config();
const express = require('express');
const multer = require('multer');
const pdf = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');

const app = express();
const upload = multer();
const port = 3001;

app.use(cors());
app.use(express.json()); 

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

async function extractTextFromPdf(pdfBuffer) {
  try {
    const data = await pdf(pdfBuffer);
    return data.text;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    return null;
  }
}

const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

async function analyzeText(extractedText) {
  try {
    console.log('Using model:', model.name);

    const prompt = `From the following text, identify and categorize the "Skills", "Experiences", and "Projects". Provide the output in a structured format, and nothing extra, just the JSON object.
    Text:
    ${extractedText}

    Skills:
    - list of skills
    Experiences:
    - list of json objects, each with keys - "company","title","location","description"
    Projects:
    - list or projects with keys - "name","technologies","description"
    In case if any of the values are not present, please return an empty list for that key.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response?.candidates?.[0]?.content?.parts?.[0]?.text;
    return responseText || null;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return null;
  }
}

app.post('/api/process-pdf', upload.single('pdfFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No PDF file uploaded.');
    }

    const pdfBuffer = req.file.buffer;
    const extractedText = await extractTextFromPdf(pdfBuffer);

    if (!extractedText) {
      return res.status(500).send('Failed to extract text from PDF.');
    }

    console.log('Extracted Text:', extractedText.substring(0, 200) + '...');

    const geminiOutput = await analyzeText(extractedText);

    if (geminiOutput) {
      const jsonRegex = /\{[\s\S]*\}/;
      const match = geminiOutput.match(jsonRegex);

      if (match) {
        const extractedJson = match[0];
        console.log('Extracted JSON:', extractedJson);
        try {
          const parsedData = JSON.parse(extractedJson);
          console.log('Parsed Data:', parsedData);
          res.json(parsedData);
        } catch (error) {
          console.error('Error parsing extracted JSON:', error);
          res.status(500).send('Failed to parse the analysis result from Gemini.');
        }
      } else {
        console.log('No JSON object found in Gemini output:', geminiOutput);
        res.status(500).send('Failed to find structured data in Gemini response.');
      }
    } else {
      res.status(500).send('Failed to get a meaningful response from Gemini.');
    }

  } catch (error) {
    console.error('Error processing PDF:', error);
    res.status(500).send('Failed to process the PDF.');
  }
});

app.post('/api/analyze-job-description', express.json(), async (req, res) => {
  const { jobDescription } = req.body;

  if (!jobDescription || jobDescription.trim() === '') {
    return res.status(400).json({ error: 'Please provide a job description.' });
  }

  try {
    const prompt = `Analyze the following job description and extract the:
    - Required Skills
    - Necessary Requirements
    - Preferred Requirements

    Provide the output as a JSON object with keys "requiredSkills", "necessaryRequirements", and "preferredRequirements", where each key's value is a list of strings.

    Job Description:
    ${jobDescription}
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (responseText) {
      try {
        const cleanedResponse = responseText
          .replace(/```json/i, '')
          .replace(/```/g, '')
          .trim();
        const parsedResult = JSON.parse(cleanedResponse);
        res.json(parsedResult);
      } catch (jsonError) {
        console.error('Error parsing Gemini output as JSON:', jsonError);
        res.status(500).json({ error: 'Failed to parse analysis result from Gemini.' });
      }
    } else {
      res.status(500).json({ error: 'Failed to get analysis from Gemini.' });
    }

  } catch (error) {
    console.error('Error calling Gemini API for job description analysis:', error);
    res.status(500).json({ error: 'Failed to analyze job description.', details: error.message });
  }
});

app.post('/api/compare-resume-jd', express.json(), async (req, res) => {
  const { resumeData, jdAnalysis } = req.body;

  if (!resumeData || !jdAnalysis) {
    return res.status(400).json({ error: 'Both resume data and job description analysis are required.' });
  }

  try {
    const prompt = `Based on the following extracted information from a resume and the analysis of a job description, determine the percentage match between the resume and the job description. 
    Consider the skills, experiences, and projects from the resume and compare them to the required skills, necessary requirements, and preferred requirements from the job description. 
    Please skip any matches related to education background. Please do the comparison on the basis of ATS score generation and give me a list of suggestions to improve the resume. 
    Please give all of the suggestions in the form of a JSON object that has following format 
    ResumeJDComparison : {
        Suggestions : [list of suggestions to improve the resume],
        AnalysisDetails : {
            MatchPercentage : [number],
            Reasoning : [list of strings explaining the reasoning behind the match percentage]
            UnmatchedPreferredKeywords : [list of preferred keywords that were expected in resume but are not present],
            UnmatchedRequiredKeywords : [list of preferred keywords that were expected in resume but are not present],
            MatchedRequiredKeywords : [list of preferred keywords that were present in resume],
            MatchedPreferredKeywords : [list of preferred keywords that were present in resume]
        }
    }
    Resume Data:
    ${JSON.stringify(resumeData)}

    Job Description Analysis:
    ${JSON.stringify(jdAnalysis)}

    Provide the match percentage as a single number (e.g., 75).`;

    const result = await model.generateContent(prompt);
    const responseText = result.response?.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log('Gemini response for comparison:', responseText);    

    if (responseText) {
        if(typeof responseText == "string" && responseText.startsWith("```json") && responseText.endsWith("```")) {
            const comparison = JSON.parse(responseText.substring(8, responseText.length - 3));
            res.json({ suggestions: comparison });
        } else if (typeof responseText == "object" && responseText.hasOwnProperty("ResumeJDComparison")) {
            res.json({ suggestions: responseText.ResumeJDComparison });
        }
        res.json({ suggestions: responseText});
    } else {
      console.log('Gemini response for comparison:', responseText);
      res.status(500).json({ error: 'Failed to get a valid match percentage from Gemini.' });
    }

  } catch (error) {
    console.error('Error comparing resume and JD:', error);
    res.status(500).json({ error: 'Failed to compare resume and job description.', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});
