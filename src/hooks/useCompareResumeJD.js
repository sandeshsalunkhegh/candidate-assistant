import { useState } from 'react';
import { compareResumeJD } from '../services/api';

/**
 * Custom hook to compare resume data with job description analysis.
 * @returns {{
 *   compare: (params: { resumeData: any, jdAnalysis: any, jobTitle?: string, industry?: string }) => Promise<any>,
 *   loading: boolean,
 *   error: string,
 *   result: any,
 *   reset: () => void
 * }}
 */
function getFriendlyCompareError(error) {
  if (!error) return '';
  if (typeof error !== 'string') return 'An unknown error occurred.';
  if (error.includes('Both resume data and job description analysis are required')) return 'Please process both a resume and a job description first.';
  if (error.includes('Failed to get a valid match percentage')) return "Sorry, we couldn't compare the resume and JD. Try again.";
  if (error.includes('Network')) return 'Network error. Please check your connection.';
  if (error.includes('500')) return 'Server error. Please try again later.';
  return 'An error occurred: ' + error;
}

export default function useCompareResumeJD() {
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

  const compare = async ({ resumeData, jdAnalysis, jobTitle, industry }) => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await compareResumeJD({ resumeData, jdAnalysis, jobTitle, industry });
      setResult(data);
      return data;
    } catch (err) {
      setError(getFriendlyCompareError(err?.response?.data?.error || err?.message || 'Failed to compare resume and JD.'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { compare, loading, error, result, reset };
} 