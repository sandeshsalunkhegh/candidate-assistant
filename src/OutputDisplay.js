import React from 'react';
require('./OutputDisplay.css');

function OutputDisplay({ data }) {
  if (!data) {
    return <div>No data to display yet. Upload a PDF to get started.</div>;
  }
  if(typeof data === 'string') {
    data = JSON.parse(data);
  }
    return (
    <div className="output-container">
        {data.Skills && data.Skills.length > 0 && (
            <div className="output-section">
                <h2 className="output-title">Skills</h2>
                <ul className="output-list">
                    {data.Skills.map((skill, index) => (
                        <li key={index} className="output-item">{skill}</li>
                    ))}
                </ul>
            </div>
        )}

        {data.Experiences && data.Experiences.length > 0 && (
            <div className="output-section">
                <h2 className="output-title">Experiences</h2>
                <ul className="output-list">
                    {data.Experiences.map((exp, index) => (
                        <li key={index} className="output-item">
                            <h3>{exp.title}</h3>
                            <p><strong>Company:</strong> {exp.company}</p>
                            <p><strong>Location:</strong> {exp.location}</p>
                            <p><strong>Description:</strong> {exp.description}</p>
                        </li>
                    ))}
                </ul>
            </div>
        )}

        {data.Projects && data.Projects.length > 0 && (
            <div className="output-section">
                <h2 className="output-title">Projects</h2>
                <ul className="output-list">
                    {data.Projects.map((project, index) => (
                        <li key={index} className="output-item">
                            <h3>{project.name}</h3>
                            <p><strong>Technologies:</strong> {project.technologies}</p>
                            {project.description && (
                                <p><strong>Description:</strong> {project.description}</p>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        )}

        {!data.Skills && !data.Experiences && !data.Projects && (
            <div className="output-section">
                <p>No specific skills, experiences, or projects found in the processed data.</p>
            </div>
        )}
    </div>
);
}

export default OutputDisplay;
