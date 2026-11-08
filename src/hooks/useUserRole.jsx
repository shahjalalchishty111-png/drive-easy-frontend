import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';
import useAxiosPublic from './useAxiosPublic';

// Resolves the signed-in user's DB record (role, name, photo) from MongoDB by email.
// Replaces the old mock AppProvider role state.
const useUserRole = () => {
  const { user, loading } = useAuth();
  const axios = useAxiosPublic();

  const { data: dbUser, isLoading, isError } = useQuery({
    queryKey: ['user-role', user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      try {
        const { data } = await axios.get(`/api/users/email/${user.email}`);
        return data;
      } catch (err) {
        // A signed-in user without a DB record (e.g. Google sign-in) defaults to customer.
        if (err.response?.status === 404) return null;
        throw err;
      }
    },
  });

  return {
    dbUser,
    role: dbUser?.role || 'user',
    roleLoading: loading || (!!user && isLoading),
    isError,
  };
};

export default useUserRole;
