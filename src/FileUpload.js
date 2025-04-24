import React, { useState, useRef } from 'react';
import './FileUpload.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faFilePdf, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

function FileUpload({ onDataReceived }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setUploadError('');
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      setUploadError('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('Please select a file.');
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);
    setUploadError('');
    const formData = new FormData();
    formData.append('pdfFile', selectedFile);

    try {
      const response = await fetch('http://localhost:3001/api/process-pdf', { // Backend API URL
        method: 'POST',
        body: formData,
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      onDataReceived(data);
    } catch (error) {
      console.error("Error uploading and processing PDF:", error);
      setUploadError(error.message || 'Failed to process the PDF. Please try again.');
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
      // Keep the file selected for better feedback, clear only on next action
      // setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset the input for re-selection of the same file
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleClearSelection = () => {
    setSelectedFile(null);
    setUploadError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div
      className={`file-upload-container ${isLoading ? 'uploading' : ''} ${selectedFile ? 'file-selected' : ''}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept=".pdf"
        className="file-upload-input"
        id="pdfUpload"
        onChange={handleFileChange}
        ref={fileInputRef}
      />
      <div className="upload-area" onClick={handleButtonClick}>
        {selectedFile ? (
          <div className="selected-file-info">
            <FontAwesomeIcon icon={faFilePdf} className="file-icon" />
            <span className="file-name">{selectedFile.name}</span>
            <button
              type="button"
              className="clear-file-button"
              onClick={handleClearSelection}
              aria-label="Clear selected file"
            >
              <FontAwesomeIcon icon={faTimesCircle} />
            </button>
          </div>
        ) : (
          <>
            <FontAwesomeIcon icon={faUpload} className="upload-icon" />
            <p>Drag and drop your PDF here or click to browse</p>
          </>
        )}
      </div>
      <button onClick={handleUpload} disabled={!selectedFile || isLoading} className="process-button">
        {isLoading ? 'Processing...' : 'Process'}
      </button>
      {isLoading && uploadProgress > 0 && (
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${uploadProgress}%` }}>
            {uploadProgress}%
          </div>
        </div>
      )}
      {uploadError && <div className="file-upload-error">{uploadError}</div>}
    </div>
  );
}

export default FileUpload;
