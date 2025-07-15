const express = require('express');
const router = express.Router();
const { analyzeJDWithGemini } = require('../services/jdService');

router.post('/api/analyze-job-description', express.json(), async (req, res) => {
  const { jobDescription, jobTitle, industry } = req.body;

  if (!jobDescription || jobDescription.trim() === '') {
    return res.status(400).json({ error: 'Please provide a job description.' });
  }

  try {
    const result = await analyzeJDWithGemini({ jobDescription, jobTitle, industry });
    res.json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 