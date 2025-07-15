import React from 'react';
import FileUpload from '../FileUpload';

function ResumeUpload({ onDataReceived, loading, error, onStart }) {
  return (
    <section className="section-container">
      <h2>Process PDF for Resume Analysis</h2>
      <FileUpload onDataReceived={onDataReceived} loading={loading} error={error} onStart={onStart} />
      {error && <p className="error-message">{error}</p>}
      {loading && <p className="loading-indicator">Processing PDF...</p>}
    </section>
  );
}

export default ResumeUpload; 