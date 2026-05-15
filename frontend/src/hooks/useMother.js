import { useState, useEffect } from 'react';
import { motherService } from '../services/motherService';

export const useMother = (id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMother = async () => {
      try {
        const result = await motherService.getProfile(id || 'current');
        setData(result);
      } catch (error) {
        console.error("Failed to fetch mother data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMother();
  }, [id]);

  return { data, loading };
};
