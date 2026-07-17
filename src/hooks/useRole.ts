import { useProfile } from './useProfile';

export const useRole = () => {
  const { profile, isLoading } = useProfile();

  return {
    role: profile?.role || null,
    isRequester: profile?.role === 'requester',
    isVolunteer: profile?.role === 'volunteer',
    isAdmin: profile?.role === 'admin',
    isLoadingRole: isLoading,
  };
};
