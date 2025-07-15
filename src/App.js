import React, { useState, useEffect } from 'react';
import './App.css';
import './FileUpload.css';
import './OutputDisplay.css';
import './ResumeJDAnalyzer.css';
import JobTitleIndustryFields from './components/JobTitleIndustryFields';
import JobDescriptionForm from './components/JobDescriptionForm';
import ResumeUpload from './components/ResumeUpload';
import AnalysisResult from './components/AnalysisResult';
import ComparisonResult from './components/ComparisonResult';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import useAnalyzeJobDescription from './hooks/useAnalyzeJobDescription';
import ResumeJdAnalyzer from './ResumeJDAnalyzer'; // TODO: Refactor this to be modular if not already

function App() {
  const [processedData, setProcessedData] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loadingResume, setLoadingResume] = useState(false);
  const [errorResume, setErrorResume] = useState('');
  const [resumeJDComparison, setResumeJDComparison] = useState(null);
  const [jobTitle, setJobTitle] = useState('');
  const [industry, setIndustry] = useState('');
  const [activeSection, setActiveSection] = useState('#resume-analysis-result');

  useEffect(() => {
    const sectionIds = [
      '#resume-analysis-result',
      '#jd-analysis-result',
      '#comparison',
    ];
    const handleScroll = () => {
      const scrollY = window.scrollY;
      let found = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.querySelector(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const top = rect.top + window.scrollY - 80; // offset for header
          if (scrollY >= top - 10) {
            found = id;
          }
        }
      }
      setActiveSection(found);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Use custom hook for JD analysis
  const {
    analyze: analyzeJD,
    loading: loadingJobDescription,
    error: errorJobDescription,
    result: analysisResult
  } = useAnalyzeJobDescription();

  const handlePdfDataReceived = (data) => {
    setProcessedData(data);
    setErrorResume('');
    setLoadingResume(false);
  };

  const handleJobDescriptionInputChange = (event) => {
    setJobDescription(event.target.value);
    // setAnalysisResult(null); // This line is removed as per the edit hint
    // setErrorJobDescription(''); // Remove, now handled by hook
  };

  const handleJobTitleChange = (e) => setJobTitle(e.target.value);
  const handleIndustryChange = (e) => setIndustry(e.target.value);

  const handleAnalyzeJobDescription = () => {
    analyzeJD({ jobDescription, jobTitle, industry });
  };

  const handleResumeJDComparison = (data) => {
    setResumeJDComparison(data);
  };

  return (
    <div className="sidebar-container">
      <Sidebar activeSection={activeSection} />
      <div className="main-content-with-sidebar">
        <Header />
        <div className="container">
          {/* Modular: Job Title and Industry fields */}
          <JobTitleIndustryFields
            jobTitle={jobTitle}
            industry={industry}
            onJobTitleChange={handleJobTitleChange}
            onIndustryChange={handleIndustryChange}
          />
          <div className="main-analysis-row">
            <div className="analysis-card" id="jd-analysis">
              <h2 className="analysis-card-header">Analyze Job Description</h2>
              <div className="analysis-card-divider"></div>
              <JobDescriptionForm
                jobDescription={jobDescription}
                onJobDescriptionChange={handleJobDescriptionInputChange}
                onAnalyze={handleAnalyzeJobDescription}
                loading={loadingJobDescription}
                error={errorJobDescription}
              />
            </div>
            <div className="analysis-card" id="resume-analysis">
              <h2 className="analysis-card-header">Process PDF for Resume Analysis</h2>
              <div className="analysis-card-divider"></div>
              <ResumeUpload
                onDataReceived={handlePdfDataReceived}
                loading={loadingResume}
                error={errorResume}
                onStart={() => setLoadingResume(true)}
              />
            </div>
          </div>
          {/* Modular: Analysis Results */}
          <div className="sections-wrapper">
            <section className="section-container fade-in" id="jd-analysis-result">
              <h2 className="section-header">Job Description Analysis Result</h2>
              <div className="section-divider"></div>
              {loadingJobDescription ? (
                <div className="skeleton-loader" style={{ height: 80 }} />
              ) : (
                <AnalysisResult result={analysisResult} type="jd" />
              )}
            </section>
            <section className="section-container fade-in" id="resume-analysis-result">
              <h2 className="section-header">Resume Extraction Result</h2>
              <div className="section-divider"></div>
              {loadingResume ? (
                <div className="skeleton-loader" style={{ height: 80 }} />
              ) : (
                <AnalysisResult result={processedData} type="resume" />
              )}
            </section>
          </div>
          {/* Modular: Resume-JD Comparison */}
          {/* Only show comparison section if both processedData and analysisResult are present */}
          {(processedData && analysisResult) ? (
            <div className="sections-wrapper" id="comparison">
              <div className="section-container fade-in">
                <h2 className="section-header">Analyze Resume against JD</h2>
                <div className="section-divider"></div>
                <ResumeJdAnalyzer
                  resumeData={processedData}
                  jdAnalysis={analysisResult}
                  onSuggestions={handleResumeJDComparison}
                  jobTitle={jobTitle}
                  industry={industry}
                />
                {/* ComparisonResult expects the ResumeJDComparison object */}
                {resumeJDComparison?.ResumeJDComparison?.AnalysisDetails?.MatchPercentage !== undefined && (
                  <span className="badge slide-in" style={{ marginBottom: 12 }}>
                    Match: {resumeJDComparison.ResumeJDComparison.AnalysisDetails.MatchPercentage}%
                  </span>
                )}
                <ComparisonResult comparison={resumeJDComparison?.ResumeJDComparison} />
              </div>
            </div>
          ) : (
            <div className="sections-wrapper" style={{ opacity: 0.5, pointerEvents: 'none' }}>
              <div className="section-container fade-in" title="Please upload a resume and analyze a job description to enable this section." aria-live="polite">
                <h2 className="section-header" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  Analyze Resume against JD
                </h2>
                <div className="section-divider"></div>
                <div style={{ color: '#888', padding: '1rem' }}>
                  Please upload a resume and analyze a job description to enable this section.
                </div>
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
