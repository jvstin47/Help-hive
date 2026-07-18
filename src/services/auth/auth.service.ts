import { supabase } from '../supabase/client';
import { handleApiError } from '@/utils/errors';
import type { SignupPayload, LoginPayload } from '@/types/auth.types';

export class AuthService {
  /**
   * Signs in a user with email and password.
   */
  static async signInWithEmail(payload: LoginPayload) {
    if (!payload.password) throw new Error('Password is required');
    const { data, error } = await supabase.auth.signInWithPassword({
      email: payload.email,
      password: payload.password,
    });

    if (error) throw handleApiError(error);
    return data;
  }

  /**
   * Registers a new user and prepares their metadata for the profile trigger/creation.
   */
  static async signUp(payload: SignupPayload) {
    if (!payload.password) throw new Error('Password is required');
    const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          full_name: payload.fullName,
          role: payload.role,
          phone: payload.phone || null,
          address: payload.address || null,
        },
      },
    });

    if (error) throw handleApiError(error);

    // Profile creation is now handled by Postgres trigger on auth.users insert

    return data;
  }

  /**
   * Signs out the current user.
   */
  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw handleApiError(error);
  }

  /**
   * Retrieves the active session.
   */
  static async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw handleApiError(error);
    return data.session;
  }

  /**
   * Gets the current user.
   */
  static async getUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw handleApiError(error);
    return data.user;
  }
}
