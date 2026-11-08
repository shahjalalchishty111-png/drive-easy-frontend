import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosPublic from './useAxiosPublic';

// List cars with optional filter params (q, category, available, sort, owner, ...)
export const useCars = (params = {}) => {
  const axios = useAxiosPublic();
  return useQuery({
    queryKey: ['cars', params],
    queryFn: async () => {
      const { data } = await axios.get('/api/cars', { params });
      return data;
    },
  });
};

// Single car by its stable string id
export const useCar = (id) => {
  const axios = useAxiosPublic();
  return useQuery({
    queryKey: ['car', id],
    enabled: !!id,
    queryFn: async () => {
      const { data } = await axios.get(`/api/cars/${id}`);
      return data;
    },
  });
};

export const useCreateCar = () => {
  const axios = useAxiosPublic();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (car) => {
      const { data } = await axios.post('/api/cars', car);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cars'] }),
  });
};

export const useUpdateCar = () => {
  const axios = useAxiosPublic();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data } = await axios.patch(`/api/cars/${id}`, updates);
      return data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['cars'] });
      qc.invalidateQueries({ queryKey: ['car', variables.id] });
    },
  });
};

export const useDeleteCar = () => {
  const axios = useAxiosPublic();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axios.delete(`/api/cars/${id}`);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cars'] }),
  });
};
