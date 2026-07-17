import { supabase } from '../supabase/client';
import type { Request } from '@/types/database.types';
import { handleApiError } from '@/utils/errors';

export class RequestService {
  /**
   * Fetch active requests for the current requester.
   */
  static async getMyRequests(requesterId: string): Promise<Request[]> {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .eq('requester_id', requesterId)
      .order('created_at', { ascending: false });

    if (error) throw handleApiError(error);
    return data as Request[];
  }

  /**
   * Fetch a single request by ID
   */
  static async getRequestById(requestId: string): Promise<Request> {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .eq('id', requestId)
      .single();
    
    if (error) throw handleApiError(error);
    return data as Request;
  }

  /**
   * Create a new request
   */
  static async createRequest(requestData: Omit<Request, 'id' | 'created_at' | 'updated_at'>): Promise<Request> {
    const { data, error } = await supabase
      .from('requests')
      .insert(requestData as any)
      .select()
      .single();

    if (error) throw handleApiError(error);
    return data as Request;
  }
  /**
   * Fetch all active requests (for volunteers).
   */
  static async getAllRequests(): Promise<Request[]> {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw handleApiError(error);
    return data as Request[];
  }

  /**
   * Update request status
   */
  static async updateRequestStatus(requestId: string, status: string, volunteerId?: string): Promise<void> {
    const updateData: any = { status };
    if (volunteerId) updateData.volunteer_id = volunteerId;

    const { error } = await supabase
      .from('requests')
      // @ts-ignore
      .update(updateData)
      .eq('id', requestId);

    if (error) throw handleApiError(error);
  }
}
