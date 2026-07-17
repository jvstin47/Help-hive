import { supabase } from '../supabase/client';
import type { Message } from '@/types/database.types';
import { handleApiError } from '@/utils/errors';

export class MessageService {
  /**
   * Fetch messages for a specific request.
   */
  static async getMessagesByRequest(requestId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('request_id', requestId)
      .order('created_at', { ascending: true });

    if (error) throw handleApiError(error);
    return data as Message[];
  }

  /**
   * Send a new message.
   */
  static async sendMessage(messageData: Omit<Message, 'id' | 'created_at' | 'is_read'>): Promise<Message> {
    const { data, error } = await supabase
      .from('messages')
      .insert(messageData as any)
      .select()
      .single();

    if (error) throw handleApiError(error);
    return data as Message;
  }
}
