import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosPublic from './useAxiosPublic';

// Pass { user } for a customer, { owner } for an agency, or {} for admin (all).
export const useBookings = (params = {}) => {
  const axios = useAxiosPublic();
  const enabled = 'user' in params || 'owner' in params ? !!(params.user || params.owner) : true;
  return useQuery({
    queryKey: ['bookings', params],
    enabled,
    queryFn: async () => {
      const { data } = await axios.get('/api/bookings', { params });
      return data;
    },
  });
};

export const useCreateBooking = () => {
  const axios = useAxiosPublic();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (booking) => {
      const { data } = await axios.post('/api/bookings', booking);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings'] }),
  });
};

export const useUpdateBooking = () => {
  const axios = useAxiosPublic();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data } = await axios.patch(`/api/bookings/${id}`, updates);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings'] }),
  });
};
