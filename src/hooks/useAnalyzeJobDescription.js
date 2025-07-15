import { useState } from 'react';
import { analyzeJobDescription } from '../services/api';

/**
 * Custom hook to analyze a job description using the backend API.
 * @returns {{
 *   analyze: (params: { jobDescription: string, jobTitle?: string, industry?: string }) => Promise<any>,
 *   loading: boolean,
 *   error: string,
 *   result: any,
 *   reset: () => void
 * }}
 */
function getFriendlyJDAnalysisError(error) {
  if (!error) return '';
  if (typeof error !== 'string') return 'An unknown error occurred.';
  if (error.includes('Please provide a job description')) return 'Please enter a job description.';
  if (error.includes('Failed to parse')) return "Sorry, we couldn't analyze the job description. Try again.";
  if (error.includes('Network')) return 'Network error. Please check your connection.';
  if (error.includes('500')) return 'Server error. Please try again later.';
  return 'An error occurred: ' + error;
}

export default function useAnalyzeJobDescription() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  /**
   * Resets the error and result state.
   */
  const reset = () => {
    setError('');
    setResult(null);
  };

  const analyze = async ({ jobDescription, jobTitle, industry }) => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await analyzeJobDescription({ jobDescription, jobTitle, industry });
      setResult(data);
      return data;
    } catch (err) {
      setError(getFriendlyJDAnalysisError(err?.response?.data?.error || err?.message || 'Failed to analyze job description.'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { analyze, loading, error, result, reset };
} 