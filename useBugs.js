// Custom hook for managing bugs with the API service
// File: src/hooks/useBugs.js

import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/apiService';

export const useBugs = (filters = {}) => {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBugs = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiService.getBugs(filters);
      setBugs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchBugs();
  }, [fetchBugs]);

  const createBug = async (bugData) => {
    try {
      const newBug = await apiService.createBug(bugData);
      setBugs(prev => [newBug, ...prev]);
      return newBug;
    } catch (error) {
      console.error('Failed to create bug:', error);
      throw error;
    }
  };

  const updateBug = async (id, updates) => {
    try {
      const updatedBug = await apiService.updateBug(id, updates);
      setBugs(prev => prev.map(bug => 
        bug.id === id ? updatedBug : bug
      ));
      return updatedBug;
    } catch (error) {
      console.error('Failed to update bug:', error);
      throw error;
    }
  };

  const deleteBug = async (id) => {
    try {
      await apiService.deleteBug(id);
      setBugs(prev => prev.filter(bug => bug.id !== id));
    } catch (error) {
      console.error('Failed to delete bug:', error);
      throw error;
    }
  };

  return {
    bugs,
    loading,
    error,
    createBug,
    updateBug,
    deleteBug,
    refetch: fetchBugs
  };
};

export default useBugs;
