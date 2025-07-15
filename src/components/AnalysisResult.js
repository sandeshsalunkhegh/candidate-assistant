import React from 'react';
import OutputDisplay from '../OutputDisplay';

function AnalysisResult({ result, type }) {
  if (!result) return null;
  if (type === 'jd') {
    return (
      <div className="output-container">
        <h3>Analysis Result:</h3>
        {result.requiredSkills && result.requiredSkills.length > 0 && (
          <div className="output-section">
            <h4>Required Skills:</h4>
            <ul className="output-list">
              {result.requiredSkills.map((skill, index) => (
                <li key={index} className="output-item">{skill}</li>
              ))}
            </ul>
          </div>
        )}
        {result.necessaryRequirements && result.necessaryRequirements.length > 0 && (
          <div className="output-section">
            <h4>Necessary Requirements:</h4>
            <ul className="output-list">
              {result.necessaryRequirements.map((req, index) => (
                <li key={index} className="output-item">{req}</li>
              ))}
            </ul>
          </div>
        )}
        {result.preferredRequirements && result.preferredRequirements.length > 0 && (
          <div className="output-section">
            <h4>Preferred Requirements:</h4>
            <ul className="output-list">
              {result.preferredRequirements.map((prefReq, index) => (
                <li key={index} className="output-item">{prefReq}</li>
              ))}
            </ul>
          </div>
        )}
        {Object.keys(result).length === 0 && <p className="no-data">No analysis result yet.</p>}
      </div>
    );
  }
  // For resume analysis, use OutputDisplay
  return (
    <div className="output-container">
      <h3>Extracted Information:</h3>
      <OutputDisplay data={result} />
    </div>
  );
}

export default AnalysisResult; 