const express = require('express');
const multer = require('multer');
const router = express.Router();
const upload = multer();
const { extractTextFromPdf, analyzeResumeWithGemini } = require('../services/resumeService');

router.post('/api/process-pdf', upload.single('pdfFile'), async (req, res) => {
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

    try {
      const result = await analyzeResumeWithGemini({ extractedText });
      res.json(result);
    } catch (error) {
      console.error(error.message);
      res.status(500).send(error.message);
    }
  } catch (error) {
    console.error('Error processing PDF:', error);
    res.status(500).send('Failed to process the PDF.');
  }
});

module.exports = router; 