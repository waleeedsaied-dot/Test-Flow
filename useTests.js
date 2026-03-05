// Custom hook for managing tests with the API service
// File: src/hooks/useTests.js

import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/apiService';

export const useTests = (filters = {}) => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTests = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiService.getTests(filters);
      setTests(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  const createTest = async (testData) => {
    try {
      const newTest = await apiService.createTest(testData);
      setTests(prev => [newTest, ...prev]);
      return newTest;
    } catch (error) {
      console.error('Failed to create test:', error);
      throw error;
    }
  };

  const updateTest = async (id, updates) => {
    try {
      const updatedTest = await apiService.updateTest(id, updates);
      setTests(prev => prev.map(test => 
        test.id === id ? updatedTest : test
      ));
      return updatedTest;
    } catch (error) {
      console.error('Failed to update test:', error);
      throw error;
    }
  };

  const deleteTest = async (id) => {
    try {
      await apiService.deleteTest(id);
      setTests(prev => prev.filter(test => test.id !== id));
    } catch (error) {
      console.error('Failed to delete test:', error);
      throw error;
    }
  };

  return {
    tests,
    loading,
    error,
    createTest,
    updateTest,
    deleteTest,
    refetch: fetchTests
  };
};

export default useTests;
