export class AppError extends Error {
  constructor(
    public message: string,
    public code?: string,
    public status?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Normalizes an error from Supabase or network into a user-friendly AppError.
 */
export function handleApiError(error: any): AppError {
  console.error('[API Error]:', error); // Log internally for debugging

  if (error?.code === 'PGRST116') {
    return new AppError('Record not found.', error.code, 404);
  }

  // Supabase Auth errors
  if (error?.name === 'AuthApiError' || error?.status === 400) {
    if (error.message.includes('Invalid login credentials')) {
      return new AppError('We couldn\'t sign you in. Please check your email and password.');
    }
    if (error.message.includes('already registered')) {
      return new AppError('This email is already registered. Try signing in instead.');
    }
    return new AppError(error.message || 'Authentication failed. Please try again.', error.code, error.status);
  }

  // Network / Offline errors
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return new AppError('You appear to be offline. Please check your internet connection and try again.', 'OFFLINE', 0);
  }

  // Fallback for unknown errors
  return new AppError(
    error?.message || 'An unexpected error occurred. Please try again later.',
    error?.code,
    error?.status
  );
}
