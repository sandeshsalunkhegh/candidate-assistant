# Resume-JD Analyzer

AI-powered Resume and Job Description Analyzer. Instantly compare your resume to job requirements and get actionable suggestions to improve your match!

## Features
- **Upload and Analyze PDF Resumes:** Extracts skills, experiences, and projects from your resume.
- **Job Description Analysis:** Extracts required, necessary, and preferred skills from any job description.
- **Resume vs JD Comparison:** Compares your resume to a job description, provides a match percentage, and actionable suggestions to improve your fit.
- **Modern UI:** Clean, responsive, and user-friendly interface.

## Tech Stack
- **Frontend:** React
- **Backend:** Node.js (Express)
- **AI Analysis:** Google Gemini API
- **PDF Parsing:** pdf-parse
- **File Uploads:** multer

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm
- Google Gemini API key

### Installation
1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd candidate-assistant
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   - Create a `.env` file in the project root:
     ```env
     GEMINI_API_KEY=your-gemini-api-key-here
     ```
   - (Optional) To change backend port or API base URL, set `REACT_APP_API_BASE_URL` in your environment or `.env`.

### Running the App
1. **Start the backend:**
   ```bash
   node src/backend/server.js
   ```
   The backend runs on [http://localhost:3001](http://localhost:3001) by default.

2. **Start the frontend:**
   ```bash
   npm start
   ```
   The frontend runs on [http://localhost:3000](http://localhost:3000) by default.

## API Endpoints
- `POST /api/process-pdf` — Upload a PDF resume for analysis (multipart/form-data, field: `pdfFile`)
- `POST /api/analyze-job-description` — Analyze a job description (JSON: `{ jobDescription, jobTitle?, industry? }`)
- `POST /api/compare-resume-jd` — Compare resume and job description (JSON: `{ resumeData, jdAnalysis, jobTitle?, industry? }`)

## Environment Variables
- `GEMINI_API_KEY` (required): Your Google Gemini API key for AI-powered analysis.
- `REACT_APP_API_BASE_URL` (optional, frontend): Override backend API URL if not using default.

