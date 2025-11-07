import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export const useVisits = () => {
  const [visits, setVisits] = useState([]);

  const [totalVisits, setTotalVisits] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVisits = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getUserVisits(params);
      const data = response.data;
      setVisits(data.data || []);

      setTotalVisits(data.total_visits || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar visitas');
    } finally {
      setLoading(false);
    }
  };

  const createVisit = async (visitData) => {
    try {
      const response = await apiService.createVisit(visitData);
      await fetchVisits(); // Refrescar lista
      return { success: true, qrCode: response.data.qr_code };
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar visita');
      return { success: false, error: err.response?.data?.message };
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  return {
    visits,

    totalVisits,
    loading,
    error,
    createVisit,
    refetch: fetchVisits
  };
};