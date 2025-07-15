import React, { useState, useRef } from 'react';
import './FileUpload.css';
import { MdUploadFile } from 'react-icons/md';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

/**
 * FileUpload component for uploading and processing PDF resumes.
 * @param {Object} props
 * @param {(data?: any) => void} props.onDataReceived - Callback when data is received or upload starts.
 */
function getFriendlyUploadError(error) {
  if (!error) return '';
  if (typeof error !== 'string') return 'An unknown error occurred.';
  if (error.includes('No PDF file uploaded')) return 'Please select a PDF file to upload.';
  if (error.includes('Failed to extract text')) return 'Could not read your PDF. Please try another file.';
  if (error.includes('Failed to parse')) return "Sorry, we couldn't analyze your resume. Try again.";
  if (error.includes('413')) return 'File is too large. Please upload a smaller PDF.';
  if (error.includes('415')) return 'Only PDF files are supported.';
  if (error.includes('Network')) return 'Network error. Please check your connection.';
  if (error.includes('500')) return 'Server error. Please try again later.';
  return 'An error occurred: ' + error;
}

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

    if (typeof onDataReceived === 'function') {
      onDataReceived();
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
      setUploadError(getFriendlyUploadError(error.message || 'Failed to process the PDF. Please try again.'));
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

  // Keyboard accessibility for upload area
  const handleUploadAreaKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleButtonClick();
    }
  };

  return (
    <div
      className={`file-upload-container ${isLoading ? 'uploading' : ''} ${selectedFile ? 'file-selected' : ''}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      aria-busy={isLoading}
      aria-live="polite"
    >
      <input
        type="file"
        accept=".pdf"
        className="file-upload-input"
        id="pdfUpload"
        onChange={handleFileChange}
        ref={fileInputRef}
        aria-label="Upload PDF resume"
      />
      <div
        className="upload-area"
        onClick={handleButtonClick}
        onKeyDown={handleUploadAreaKeyDown}
        tabIndex={0}
        role="button"
        aria-label={selectedFile ? `Selected file: ${selectedFile.name}` : 'Drag and drop your PDF here or click to browse'}
      >
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
            <MdUploadFile className="upload-icon" />
            <p>Drag and drop your PDF here or click to browse</p>
          </>
        )}
      </div>
      <button
        onClick={handleUpload}
        disabled={!selectedFile || isLoading}
        className="process-button"
        aria-busy={isLoading}
        aria-label={isLoading ? 'Processing file' : 'Process file'}
      >
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
