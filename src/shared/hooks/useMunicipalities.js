import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export const useMunicipalities = () => {
  const [municipalities, setMunicipalities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMunicipalities = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getMunicipalities();
      setMunicipalities(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar municipios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMunicipalities();
  }, []);

  return {
    municipalities,
    loading,
    error,
    refetch: fetchMunicipalities
  };
};