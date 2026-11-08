import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosPublic from './useAxiosPublic';

// Accepts a carId string (back-compat) or a params object: { carId } | { user } | { owner } | {}
export const useReviews = (arg) => {
  const axios = useAxiosPublic();
  const params = typeof arg === 'string' ? { carId: arg } : arg || {};
  const enabled = 'user' in params || 'owner' in params ? !!(params.user || params.owner) : true;

  return useQuery({
    queryKey: ['reviews', params],
    enabled,
    queryFn: async () => {
      const { data } = await axios.get('/api/reviews', { params });
      return data;
    },
  });
};

const invalidateReviews = (qc) => {
  qc.invalidateQueries({ queryKey: ['reviews'] });
  qc.invalidateQueries({ queryKey: ['cars'] });
  qc.invalidateQueries({ queryKey: ['car'] });
};

export const useCreateReview = () => {
  const axios = useAxiosPublic();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (review) => {
      const { data } = await axios.post('/api/reviews', review);
      return data;
    },
    onSuccess: () => invalidateReviews(qc),
  });
};

export const useUpdateReview = () => {
  const axios = useAxiosPublic();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data } = await axios.patch(`/api/reviews/${id}`, updates);
      return data;
    },
    onSuccess: () => invalidateReviews(qc),
  });
};

export const useDeleteReview = () => {
  const axios = useAxiosPublic();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axios.delete(`/api/reviews/${id}`);
      return data;
    },
    onSuccess: () => invalidateReviews(qc),
  });
};
