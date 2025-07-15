const express = require('express');
const router = express.Router();
const { analyzeComparisonWithGemini } = require('../services/comparisonService');

router.post('/api/compare-resume-jd', express.json(), async (req, res) => {
  const { resumeData, jdAnalysis, jobTitle, industry } = req.body;

  if (!resumeData || !jdAnalysis) {
    return res.status(400).json({ error: 'Both resume data and job description analysis are required.' });
  }

  try {
    const result = await analyzeComparisonWithGemini({ resumeData, jdAnalysis, jobTitle, industry });
    res.json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 