import { supabase } from '../supabase/client';
import type { Profile } from '@/types/database.types';
import { handleApiError } from '@/utils/errors';

export class ProfileService {
  /**
   * Fetches a profile by User ID.
   */
  static async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found is okay for initial load before creation
      throw handleApiError(error);
    }
    return data as Profile;
  }

  /**
   * Creates or updates a profile.
   */
  static async upsertProfile(profile: Partial<Profile> & { id: string }): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .upsert(profile as any)
      .select()
      .single();

    if (error) throw handleApiError(error);
    return data as Profile;
  }

  /**
   * Checks if a profile exists and creates one from auth metadata if missing.
   * Useful during the onboarding flow.
   */
  static async ensureProfileExists(user: any): Promise<Profile> {
    let profile = await this.getProfile(user.id);
    if (!profile) {
      // Create it using data stored in user_metadata during signup
      profile = await this.upsertProfile({
        id: user.id,
        role: user.user_metadata?.role || 'requester',
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        email: user.email,
        phone: user.user_metadata?.phone || null,
        address: user.user_metadata?.address || null,
      });
    }
    return profile;
  }
}
