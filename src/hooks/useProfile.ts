import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProfileService } from '@/services/profile/profile.service';
import { useAuth } from '@/contexts/AuthContext';
import type { Profile } from '@/types/database.types';

export const useProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      if (!import.meta.env.VITE_SUPABASE_URL) {
        return {
          id: 'mock',
          role: user.user_metadata?.role || 'requester',
          full_name: 'Mock User',
          email: 'mock@mock.com',
          avatar_url: null,
        } as unknown as Profile;
      }
      // Ensure profile exists on load (useful post-registration)
      return await ProfileService.ensureProfileExists(user);
    },
    enabled: !!user,
  });

  const mutation = useMutation({
    mutationFn: (updatedProfile: Partial<Profile>) => {
      if (!user) throw new Error('No user to update');
      return ProfileService.upsertProfile({ ...updatedProfile, id: user.id });
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['profile', user?.id], data);
    },
  });

  return {
    profile: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    updateProfile: mutation.mutateAsync,
    isUpdating: mutation.isPending,
  };
};
