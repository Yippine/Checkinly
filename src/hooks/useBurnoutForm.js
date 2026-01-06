import { useState, useEffect, useCallback } from 'react';

/**
 * Shared hook for burnout questionnaire forms
 * Handles form state, localStorage persistence, scoring, and validation
 * 
 * @param {Array} questions - Array of question objects
 * @param {Function} scoringFunction - Function to calculate score from responses
 * @param {string} storageKey - localStorage key for persistence
 * @returns {Object} Form state and handlers
 */
const useBurnoutForm = (questions, scoringFunction, storageKey) => {
  const [formData, setFormData] = useState({});
  const [department, setDepartment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [savedData, setSavedData] = useState(null);

  // Load existing data from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSavedData(parsed);
        setSubmitted(true);
        setFormData(parsed.responses || {});
        setDepartment(parsed.department || '');
      }
    } catch (error) {
      console.error(`Failed to load data from localStorage (${storageKey}):`, error);
    }
  }, [storageKey]);

  // Handle single question response change
  const handleChange = useCallback((questionId, value) => {
    setFormData(prev => ({ ...prev, [questionId]: value }));
  }, []);

  // Calculate score based on current responses
  const calculateScore = useCallback(() => {
    if (!scoringFunction || !questions || questions.length === 0) {
      return 0;
    }
    return scoringFunction(formData, questions);
  }, [formData, questions, scoringFunction]);

  // Check if all questions are answered
  const isComplete = useCallback(() => {
    if (!questions || questions.length === 0) return false;
    return questions.every(q => formData[q.id] !== undefined && formData[q.id] !== null);
  }, [formData, questions]);

  // Submit form and save to localStorage
  const handleSubmit = useCallback(() => {
    if (!isComplete()) {
      alert('請完成所有問題後再提交');
      return;
    }

    if (!department) {
      alert('請選擇您的部門');
      return;
    }

    try {
      const score = calculateScore();
      const data = {
        department,
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString(),
        score,
        responses: formData,
        questionCount: questions.length
      };

      localStorage.setItem(storageKey, JSON.stringify(data));
      setSavedData(data);
      setSubmitted(true);
      
      return data;
    } catch (error) {
      console.error(`Failed to save data to localStorage (${storageKey}):`, error);
      alert('儲存失敗，請稍後再試');
      return null;
    }
  }, [formData, department, questions, storageKey, calculateScore, isComplete]);

  // Clear saved data and reset form
  const clearData = useCallback(() => {
    const confirmClear = window.confirm('確定要清除已儲存的資料嗎？此操作無法復原。');
    if (confirmClear) {
      try {
        localStorage.removeItem(storageKey);
        setFormData({});
        setDepartment('');
        setSubmitted(false);
        setSavedData(null);
      } catch (error) {
        console.error(`Failed to clear data from localStorage (${storageKey}):`, error);
        alert('清除失敗，請稍後再試');
      }
    }
  }, [storageKey]);

  // Get completion percentage
  const getProgress = useCallback(() => {
    if (!questions || questions.length === 0) return 0;
    const answered = questions.filter(q => formData[q.id] !== undefined && formData[q.id] !== null).length;
    return Math.round((answered / questions.length) * 100);
  }, [formData, questions]);

  return {
    // State
    formData,
    department,
    submitted,
    savedData,
    
    // Setters
    setDepartment,
    
    // Handlers
    handleChange,
    handleSubmit,
    clearData,
    
    // Computed
    calculateScore,
    isComplete: isComplete(),
    progress: getProgress()
  };
};

export default useBurnoutForm;
