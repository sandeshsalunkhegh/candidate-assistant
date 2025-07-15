import React from 'react';
import './ResumeJDAnalyzer.css';
import useCompareResumeJD from './hooks/useCompareResumeJD';

function ResumeJdAnalyzer({ resumeData, jdAnalysis, onSuggestions, jobTitle, industry }) {
  const {
    compare,
    loading,
    error
  } = useCompareResumeJD();

  const handleAnalyze = async () => {
    if (!resumeData || !jdAnalysis) {
      alert('Please process both a resume and a job description first.');
      return;
    }
    const data = await compare({ resumeData, jdAnalysis, jobTitle, industry });
    onSuggestions(data);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '30px' }}>
      <button onClick={handleAnalyze} disabled={loading || !resumeData || !jdAnalysis}>
        {loading ? 'Analyzing...' : 'Analyze Resume against JD'}
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default ResumeJdAnalyzer;
