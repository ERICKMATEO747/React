import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export const useBusinessMenu = (businessId) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMenu = async () => {
    if (!businessId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getBusinessMenu(businessId);
      setMenuItems(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar menú');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [businessId]);

  return {
    menuItems,
    loading,
    error,
    refetch: fetchMenu
  };
};