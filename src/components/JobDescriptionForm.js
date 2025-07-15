import React from 'react';

function JobDescriptionForm({ jobDescription, onJobDescriptionChange, onAnalyze, loading, error }) {
  return (
    <section className="section-container">
      <h2>Analyze Job Description</h2>
      <form className="jd-form" onSubmit={e => { e.preventDefault(); onAnalyze(); }}>
        <label htmlFor="jd-textarea" className="jd-label">Job Description</label>
        <textarea
          id="jd-textarea"
          className="jd-textarea"
          rows={8}
          placeholder="Paste the job description here..."
          value={jobDescription}
          onChange={onJobDescriptionChange}
          required
          aria-required="true"
        />
        <button
          type="submit"
          className="jd-analyze-btn"
          disabled={loading || !jobDescription.trim()}
          aria-busy={loading}
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
        {error && <p className="error-message" role="alert">{error}</p>}
      </form>
    </section>
  );
}

export default JobDescriptionForm; 