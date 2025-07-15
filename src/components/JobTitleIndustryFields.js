import React from 'react';

function JobTitleIndustryFields({ jobTitle, industry, onJobTitleChange, onIndustryChange }) {
  return (
    <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
      <input
        type="text"
        placeholder="Job Title (optional)"
        value={jobTitle}
        onChange={onJobTitleChange}
        style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', minWidth: 180 }}
      />
      <input
        type="text"
        placeholder="Industry (optional)"
        value={industry}
        onChange={onIndustryChange}
        style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', minWidth: 180 }}
      />
    </div>
  );
}

export default JobTitleIndustryFields; 