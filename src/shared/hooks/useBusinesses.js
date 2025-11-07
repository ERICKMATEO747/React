import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export const useBusinesses = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBusinesses = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getBusinesses(params);
      console.log('API Response:', response.data);
      const businessData = response.data.data || response.data || [];
      console.log('Businesses data:', businessData);
      setBusinesses(businessData);
    } catch (err) {
      console.error('Error fetching businesses:', err);
      setError(err.response?.data?.message || 'Error al cargar negocios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  return {
    businesses,
    loading,
    error,
    refetch: fetchBusinesses
  };
};