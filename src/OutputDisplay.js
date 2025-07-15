import React from 'react';
require('./OutputDisplay.css');

function OutputDisplay({ data }) {
  let parsedData = data;
  if (!data) {
    return (
      <div className="output-empty-card">
        <div className="output-empty-icon" aria-hidden="true">📄</div>
        <div className="output-empty-title">No data to display yet</div>
        <div className="output-empty-message">Upload a PDF resume to get started and see your extracted skills, experiences, and projects here.</div>
      </div>
    );
  }
  if (typeof data === 'string') {
    try {
      parsedData = JSON.parse(data);
    } catch (error) {
      console.error('Error parsing resume data:', error, data);
      return (
        <div className="output-empty-card">
          <div className="output-empty-icon" aria-hidden="true">❌</div>
          <div className="output-empty-title">Error displaying data</div>
          <div className="output-empty-message">Could not parse resume analysis result.</div>
        </div>
      );
    }
  }
  // Debug: log the parsed data
  console.log('OutputDisplay parsedData:', parsedData);
  // Support both capitalized and lowercased keys for compatibility with backend normalization
  const skills = parsedData.Skills || parsedData.skills;
  const experiences = parsedData.Experiences || parsedData.experiences;
  const projects = parsedData.Projects || parsedData.projects;
  return (
    <div className="output-container">
        {skills && skills.length > 0 && (
            <section className="output-section output-card fade-in" aria-label="Skills">
                <h2 className="output-title"><span className="output-icon" aria-hidden="true">🛠️</span> Skills</h2>
                <ul className="output-list">
                    {skills.map((skill, index) => (
                        <li key={index} className="output-item fade-in" style={{ animationDelay: `${index * 60}ms` }}>{skill}</li>
                    ))}
                </ul>
            </section>
        )}

        {experiences && experiences.length > 0 && (
            <section className="output-section output-card fade-in" aria-label="Experiences">
                <h2 className="output-title"><span className="output-icon" aria-hidden="true">💼</span> Experiences</h2>
                <ul className="output-list">
                    {experiences.map((exp, index) => (
                        <li key={index} className="output-item output-item-experience fade-in" style={{ animationDelay: `${index * 60}ms` }}>
                            <span className="timeline-dot" aria-hidden="true"></span>
                            <div className="output-item-content">
                                <h3>{exp.title}</h3>
                                <p><strong>Company:</strong> {exp.company}</p>
                                <p><strong>Location:</strong> {exp.location}</p>
                                {exp.years && (
                                  <span className="output-badge output-badge-years">{exp.years}</span>
                                )}
                                <p><strong>Description:</strong> {exp.description}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
        )}

        {projects && projects.length > 0 && (
            <section className="output-section output-card fade-in" aria-label="Projects">
                <h2 className="output-title"><span className="output-icon" aria-hidden="true">🚀</span> Projects</h2>
                <ul className="output-list">
                    {projects.map((project, index) => (
                        <li key={index} className="output-item output-item-project fade-in" style={{ animationDelay: `${index * 60}ms` }}>
                            <h3>{project.name}</h3>
                            <p>
                              <strong>Technologies:</strong> {project.technologies && (
                                <span className="output-badge output-badge-tech">{project.technologies}</span>
                              )}
                            </p>
                            {project.description && (
                                <p><strong>Description:</strong> {project.description}</p>
                            )}
                        </li>
                    ))}
                </ul>
            </section>
        )}

        {!skills && !experiences && !projects && (
            <div className="output-section">
                <p>No specific skills, experiences, or projects found in the processed data.</p>
            </div>
        )}
    </div>
  );
}

export default OutputDisplay;
