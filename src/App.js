import React, { useState } from 'react';
import './App.css';
import FileUpload from './FileUpload';
import OutputDisplay from './OutputDisplay';
import axios from 'axios';
import './FileUpload.css';
import './OutputDisplay.css';
import ResumeJdAnalyzer from './ResumeJDAnalyzer';
import './ResumeJDAnalyzer.css';

function App() {
  const [processedData, setProcessedData] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loadingResume, setLoadingResume] = useState(false);
  const [loadingJobDescription, setLoadingJobDescription] = useState(false);
  const [errorResume, setErrorResume] = useState('');
  const [errorJobDescription, setErrorJobDescription] = useState('');
  const [resumeJDComparison, setResumeJDComparison] = useState(null);

  const apiUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001'; // Default for development

  const handlePdfDataReceived = async (file) => {
    setProcessedData(file);
    setErrorResume('');
    setLoadingResume(true);
  };

  const handleJobDescriptionInputChange = (event) => {
    setJobDescription(event.target.value);
    setAnalysisResult(null);
    setErrorJobDescription('');
  };

  const handleAnalyzeJobDescription = async () => {
    setLoadingJobDescription(true);
    setAnalysisResult(null);
    setErrorJobDescription('');

    try {
      const response = await axios.post(`${apiUrl}/api/analyze-job-description`, {
        jobDescription: jobDescription,
      });
      setAnalysisResult(response.data);
    } catch (err) {
      console.error('Error analyzing job description:', err);
      setErrorJobDescription('Failed to analyze job description.');
      if (err.response && err.response.data && err.response.data.error) {
        setErrorJobDescription(err.response.data.error);
      }
    } finally {
      setLoadingJobDescription(false);
    }
  };

  const handleResumeJDComparison = (data) => {
    setResumeJDComparison(data);
  };

  return (
    <div className="container">
      <h1>Resume and Job Description Analysis</h1>

      <div className="sections-wrapper">
        <section className="section-container">
          <h2>Analyze Job Description</h2>
          <textarea
            rows="8"
            cols="60"
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={handleJobDescriptionInputChange}
          />
          <button
            onClick={handleAnalyzeJobDescription}
            disabled={loadingJobDescription || !jobDescription.trim()}
          >
            {loadingJobDescription ? 'Analyzing...' : 'Analyze'}
          </button>

          {errorJobDescription && <p className="error-message">{errorJobDescription}</p>}

          {analysisResult && (
            <div className="output-container">
              <h3>Analysis Result:</h3>
              {analysisResult.requiredSkills && analysisResult.requiredSkills.length > 0 && (
                <div className="output-section">
                  <h4>Required Skills:</h4>
                  <ul className="output-list">
                    {analysisResult.requiredSkills.map((skill, index) => (
                      <li key={index} className="output-item">{skill}</li>
                    ))}
                  </ul>
                </div>
              )}

              {analysisResult.necessaryRequirements && analysisResult.necessaryRequirements.length > 0 && (
                <div className="output-section">
                  <h4>Necessary Requirements:</h4>
                  <ul className="output-list">
                    {analysisResult.necessaryRequirements.map((req, index) => (
                      <li key={index} className="output-item">{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              {analysisResult.preferredRequirements && analysisResult.preferredRequirements.length > 0 && (
                <div className="output-section">
                  <h4>Preferred Requirements:</h4>
                  <ul className="output-list">
                    {analysisResult.preferredRequirements.map((prefReq, index) => (
                      <li key={index} className="output-item">{prefReq}</li>
                    ))}
                  </ul>
                </div>
              )}

              {Object.keys(analysisResult).length === 0 && !errorJobDescription && <p className="no-data">No analysis result yet.</p>}
            </div>
          )}
        </section>

        <section className="section-container">
          <h2>Process PDF for Resume Analysis</h2>
          <FileUpload onDataReceived={handlePdfDataReceived} loading={loadingResume} error={errorResume} />
          {processedData && (
            <div className="output-container">
              <h3>Extracted Information:</h3>
              <OutputDisplay data={processedData} />
            </div>
          )}
          {errorResume && <p className="error-message">{errorResume}</p>}
          {loadingResume && <p className="loading-indicator">Processing PDF...</p>}
          {!processedData && !errorResume && !loadingResume && <p className="no-data">Upload a PDF to analyze.</p>}
        </section>
      </div>

      {(processedData && analysisResult) && (
        <div className="sections-wrapper">
          <div className="section-container">
            <h2>Analyze Resume against JD</h2>
            <ResumeJdAnalyzer
              resumeData={processedData}
              jdAnalysis={analysisResult}
              onSuggestions={handleResumeJDComparison}
            />
            {/* Removed console.log statements */}
            {resumeJDComparison !== null && resumeJDComparison.ResumeJDComparison && (
              <div className="output-container" style={{ marginTop: '20px' }}>
                <h3>Resume-JD Comparison:</h3>
                {resumeJDComparison.ResumeJDComparison.Suggestions && resumeJDComparison.ResumeJDComparison.Suggestions.length > 0 && (
                  <div className="output-section">
                    <h4>Suggestions:</h4>
                    <ul className="output-list">
                      {resumeJDComparison.ResumeJDComparison.Suggestions.map((suggestion, index) => (
                        <li key={index} className="output-item">{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {resumeJDComparison.ResumeJDComparison.AnalysisDetails && (
                  <div className="output-section">
                    <h4>Analysis Details:</h4>
                    {resumeJDComparison.ResumeJDComparison.AnalysisDetails.MatchPercentage !== undefined && (
                      <p className="output-item">
                        <strong>Match Percentage:</strong> {resumeJDComparison.ResumeJDComparison.AnalysisDetails.MatchPercentage}%
                      </p>
                    )}
                    {resumeJDComparison.ResumeJDComparison.AnalysisDetails.Reasoning && resumeJDComparison.ResumeJDComparison.AnalysisDetails.Reasoning.length > 0 && (
                      <div className="output-section">
                        <h4>Reasoning:</h4>
                        <ul className="output-list">
                          {resumeJDComparison.ResumeJDComparison.AnalysisDetails.Reasoning.map((reason, index) => (
                            <li key={index} className="output-item">{reason}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {resumeJDComparison.ResumeJDComparison.AnalysisDetails.MatchedRequiredKeywords && resumeJDComparison.ResumeJDComparison.AnalysisDetails.MatchedRequiredKeywords.length > 0 && (
                      <div className="output-section">
                        <h4>Matched Required Keywords:</h4>
                        <ul className="output-list">
                          {resumeJDComparison.ResumeJDComparison.AnalysisDetails.MatchedRequiredKeywords.map((keyword, index) => (
                            <li key={index} className="output-item">{keyword}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {resumeJDComparison.ResumeJDComparison.AnalysisDetails.MatchedPreferredKeywords && resumeJDComparison.ResumeJDComparison.AnalysisDetails.MatchedPreferredKeywords.length > 0 && (
                      <div className="output-section">
                        <h4>Matched Preferred Keywords:</h4>
                        <ul className="output-list">
                          {resumeJDComparison.ResumeJDComparison.AnalysisDetails.MatchedPreferredKeywords.map((keyword, index) => (
                            <li key={index} className="output-item">{keyword}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {resumeJDComparison.ResumeJDComparison.AnalysisDetails.UnmatchedRequiredKeywords && resumeJDComparison.ResumeJDComparison.AnalysisDetails.UnmatchedRequiredKeywords.length > 0 && (
                      <div className="output-section">
                        <h4>Unmatched Required Keywords:</h4>
                        <ul className="output-list">
                          {resumeJDComparison.ResumeJDComparison.AnalysisDetails.UnmatchedRequiredKeywords.map((keyword, index) => (
                            <li key={index} className="output-item">{keyword}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {resumeJDComparison.ResumeJDComparison.AnalysisDetails.UnmatchedPreferredKeywords && resumeJDComparison.ResumeJDComparison.AnalysisDetails.UnmatchedPreferredKeywords.length > 0 && (
                      <div className="output-section">
                        <h4>Unmatched Preferred Keywords:</h4>
                        <ul className="output-list">
                          {resumeJDComparison.ResumeJDComparison.AnalysisDetails.UnmatchedPreferredKeywords.map((keyword, index) => (
                            <li key={index} className="output-item">{keyword}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
