import React, { useState } from 'react';
import './ResumeJDAnalyzer.css';

function ResumeJdAnalyzer({ resumeData, jdAnalysis, onSuggestions }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!resumeData || !jdAnalysis) {
      alert('Please process both a resume and a job description first.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/compare-resume-jd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resumeData, jdAnalysis }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      onSuggestions(data.suggestions);

    } catch (err) {
      console.error('Error analyzing resume against JD:', err);
      setError(err.message);
      onSuggestions(null); // Reset match percentage on error
    } finally {
      setLoading(false);
    }
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
