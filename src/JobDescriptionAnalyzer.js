import React from 'react';
import './OutputDisplay.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faMapMarkerAlt, faCode, faTag, faLightbulb } from '@fortawesome/free-solid-svg-icons';

function OutputDisplay({ data }) {
  if (!data) {
    return (
      <div className="output-container empty-state">
        <FontAwesomeIcon icon={faLightbulb} className="empty-state-icon" />
        <p className="empty-state-text">No data to display yet. Upload a PDF to get started.</p>
      </div>
    );
  }
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch (error) {
      console.error('Error parsing data:', error);
      return (
        <div className="output-container error-state">
          <p className="error-text">Error displaying data.</p>
        </div>
      );
    }
  }

  return (
    <div className="output-container">
      {data.Skills && data.Skills.length > 0 && (
        <div className="output-section">
          <h2 className="output-title">Skills</h2>
          <ul className="output-list skills-list">
            {data.Skills.map((skill, index) => (
              <li key={index} className="output-item skill-item">
                <FontAwesomeIcon icon={faTag} className="item-icon" />
                {skill}
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.Experiences && data.Experiences.length > 0 && (
        <div className="output-section experiences-section">
          <h2 className="output-title">Experiences</h2>
          <ul className="output-list experiences-list">
            {data.Experiences.map((exp, index) => (
              <li key={index} className="output-item experience-item">
                <h3>{exp.title}</h3>
                <p>
                  <FontAwesomeIcon icon={faBriefcase} className="item-icon" />
                  <strong>Company:</strong> {exp.company}
                </p>
                <p>
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="item-icon" />
                  <strong>Location:</strong> {exp.location}
                </p>
                {exp.description && <p className="description"><strong>Description:</strong> {exp.description}</p>}
                {exp.startDate && exp.endDate && (
                  <p className="duration">
                    <strong>Duration:</strong> {exp.startDate} - {exp.endDate}
                  </p>
                )}
                {exp.startDate && !exp.endDate && (
                  <p className="duration">
                    <strong>Duration:</strong> {exp.startDate} - Present
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.Projects && data.Projects.length > 0 && (
        <div className="output-section projects-section">
          <h2 className="output-title">Projects</h2>
          <ul className="output-list projects-list">
            {data.Projects.map((project, index) => (
              <li key={index} className="output-item project-item">
                <h3>{project.name}</h3>
                {project.technologies && (
                  <p>
                    <FontAwesomeIcon icon={faCode} className="item-icon" />
                    <strong>Technologies:</strong>
                    <span className="technologies">
                      {project.technologies.split(',').map((tech, i) => (
                        <span key={i} className="technology-badge">
                          {tech.trim()}
                        </span>
                      ))}
                    </span>
                  </p>
                )}
                {project.description && (
                  <p className="description"><strong>Description:</strong> {project.description}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!data.Skills && !data.Experiences && !data.Projects && (
        <div className="output-section empty-data">
          <p className="empty-data-text">No specific skills, experiences, or projects found in the processed data.</p>
        </div>
      )}
    </div>
  );
}

export default OutputDisplay;
