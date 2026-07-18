import { supabase } from '../supabase/client';
import { handleApiError } from '@/utils/errors';

export class StorageService {
  /**
   * Uploads an avatar image and returns the public URL.
   */
  static async uploadAvatar(userId: string, file: File): Promise<string> {
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      throw new Error('Only JPG, PNG, WEBP, and GIF images are allowed.');
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size must be less than 5MB.');
    }
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/avatar-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw handleApiError(uploadError);

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    return data.publicUrl;
  }
}
