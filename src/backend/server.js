require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Import modular routers
const processPdfRouter = require('./routes/processPdf');
const analyzeJobDescriptionRouter = require('./routes/analyzeJobDescription');
const compareResumeJDRouter = require('./routes/compareResumeJD');

// Root health check route
app.get('/', (req, res) => {
  res.send({ status: 'ok', message: 'Candidate Assistant backend is running.' });
});

// Use routers
app.use(processPdfRouter);
app.use(analyzeJobDescriptionRouter);
app.use(compareResumeJDRouter);

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error.' });
});

app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});
