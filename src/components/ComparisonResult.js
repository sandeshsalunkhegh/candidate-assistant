import React from 'react';

function ComparisonResult({ comparison }) {
  if (!comparison) return null;
  return (
    <div className="output-container fade-in" style={{ marginTop: '20px' }}>
      <h3 className="output-title">Resume-JD Comparison</h3>
      {comparison.Suggestions && comparison.Suggestions.length > 0 && (
        <div className="output-section">
          <h4>Suggestions <span className="badge" title="AI-powered suggestions to improve your resume">AI</span></h4>
          <ul className="output-list">
            {comparison.Suggestions.map((suggestion, index) => (
              <li key={index} className="output-item fade-in" style={{ background: '#e8f5e9', fontWeight: 'bold', borderLeft: '4px solid #43a047' }}>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
      {comparison.AnalysisDetails && (
        <div className="output-section">
          <h4>Analysis Details</h4>
          {comparison.AnalysisDetails.MatchPercentage !== undefined && (
            <p className="output-item fade-in">
              <strong>Match Percentage:</strong>
              <span className="badge" title="How well your resume matches the job description">
                {comparison.AnalysisDetails.MatchPercentage}%
              </span>
            </p>
          )}
          {comparison.AnalysisDetails.Reasoning && comparison.AnalysisDetails.Reasoning.length > 0 && (
            <div className="output-section">
              <h4>Reasoning</h4>
              <ul className="output-list">
                {comparison.AnalysisDetails.Reasoning.map((reason, index) => (
                  <li key={index} className="output-item fade-in" style={{ background: '#e3f2fd', borderLeft: '4px solid #1976d2' }}>{reason}</li>
                ))}
              </ul>
            </div>
          )}
          {/* Matched Required Keywords with Confidence Scores */}
          {comparison.AnalysisDetails.MatchedRequiredKeywords && comparison.AnalysisDetails.MatchedRequiredKeywords.length > 0 && (
            <div className="output-section">
              <h4>Matched Required Keywords</h4>
              <ul className="output-list">
                {comparison.AnalysisDetails.MatchedRequiredKeywords.map((keyword, index) => {
                  const conf = comparison.AnalysisDetails.ConfidenceScores?.requiredSkills?.[keyword];
                  return (
                    <li key={index} className="output-item fade-in" style={{ color: '#2e7d32', background: '#e8f5e9', fontWeight: 'bold' }}>
                      {keyword}
                      {conf !== undefined && (
                        <span className="badge" title="Confidence score for this skill">
                          {Math.round(conf * 100)}%
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          {/* Matched Preferred Keywords with Confidence Scores */}
          {comparison.AnalysisDetails.MatchedPreferredKeywords && comparison.AnalysisDetails.MatchedPreferredKeywords.length > 0 && (
            <div className="output-section">
              <h4>Matched Preferred Keywords</h4>
              <ul className="output-list">
                {comparison.AnalysisDetails.MatchedPreferredKeywords.map((keyword, index) => {
                  const conf = comparison.AnalysisDetails.ConfidenceScores?.preferredRequirements?.[keyword];
                  return (
                    <li key={index} className="output-item fade-in" style={{ color: '#2e7d32', background: '#e8f5e9', fontWeight: 'bold' }}>
                      {keyword}
                      {conf !== undefined && (
                        <span className="badge" title="Confidence score for this skill">
                          {Math.round(conf * 100)}%
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          {/* Matched Necessary Keywords with Confidence Scores */}
          {comparison.AnalysisDetails.MatchedNecessaryKeywords && comparison.AnalysisDetails.MatchedNecessaryKeywords.length > 0 && (
            <div className="output-section">
              <h4>Matched Necessary Requirements</h4>
              <ul className="output-list">
                {comparison.AnalysisDetails.MatchedNecessaryKeywords.map((keyword, index) => {
                  const conf = comparison.AnalysisDetails.ConfidenceScores?.necessaryRequirements?.[keyword];
                  return (
                    <li key={index} className="output-item fade-in" style={{ color: '#2e7d32', background: '#e8f5e9', fontWeight: 'bold' }}>
                      {keyword}
                      {conf !== undefined && (
                        <span className="badge" title="Confidence score for this requirement">
                          {Math.round(conf * 100)}%
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          {/* Unmatched Required/Preferred Keywords */}
          {comparison.AnalysisDetails.UnmatchedRequiredKeywords && comparison.AnalysisDetails.UnmatchedRequiredKeywords.length > 0 && (
            <div className="output-section">
              <h4>Unmatched Required Keywords</h4>
              <ul className="output-list">
                {comparison.AnalysisDetails.UnmatchedRequiredKeywords.map((keyword, index) => (
                  <li key={index} className="output-item fade-in" style={{ color: '#b71c1c', background: '#ffebee', fontWeight: 'bold' }}>{keyword}</li>
                ))}
              </ul>
            </div>
          )}
          {comparison.AnalysisDetails.UnmatchedPreferredKeywords && comparison.AnalysisDetails.UnmatchedPreferredKeywords.length > 0 && (
            <div className="output-section">
              <h4>Unmatched Preferred Keywords</h4>
              <ul className="output-list">
                {comparison.AnalysisDetails.UnmatchedPreferredKeywords.map((keyword, index) => (
                  <li key={index} className="output-item fade-in" style={{ color: '#b71c1c', background: '#ffebee', fontWeight: 'bold' }}>{keyword}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ComparisonResult; 