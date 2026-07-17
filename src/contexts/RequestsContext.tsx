/**
 * @file RequestsContext.tsx
 * 
 * ARCHITECTURAL RESPONSIBILITY BOUNDARY:
 * - RequestsContext is currently responsible for:
 *   - Local mock state of requests (useful during offline/prototype runs).
 *   - Optimistic state management and broad application-level distribution of requests.
 * - Intent for TanStack Query (React Query):
 *   - Server-sourced request data (e.g. fetching lists, caching request status, detail fetching, and status mutations)
 *     should belong strictly to TanStack Query (i.e. React Query query/mutation hooks).
 *   - RequestsContext should eventually be refactored to only contain UI-only state (e.g. currently selected request, wizard draft state).
 * 
 * TODO: Migrate the server-sourced requests loading, cache key validation, and status modifications (fetchRequests, addRequest, updateRequestStatus)
 * to TanStack Query hooks to decouple client UI state from backend caching.
 */

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { MOCK_REQUESTS } from '@/utils/seed';
import type { Request, RequestStatus } from '@/types/database.types';
import { RequestService } from '@/services/request/request.service';
import { useAuth } from './AuthContext';
import { supabase } from '@/services/supabase/client';

interface RequestsContextType {
  requests: Request[];
  addRequest: (request: Omit<Request, 'id' | 'status' | 'created_at' | 'updated_at'>) => void;
  updateRequestStatus: (id: string, status: RequestStatus, volunteerId?: string) => void;
}

const RequestsContext = createContext<RequestsContextType | undefined>(undefined);

export const RequestsProvider = ({ children }: { children: ReactNode }) => {
  const [requests, setRequests] = useState<Request[]>(MOCK_REQUESTS as Request[]);
  const { user } = useAuth();

  useEffect(() => {
    if (!import.meta.env.VITE_SUPABASE_URL || !user) return;

    const fetchRequests = async () => {
      try {
        const isVolunteer = user.user_metadata?.role === 'volunteer';
        let data;
        if (isVolunteer) {
          data = await RequestService.getAllRequests();
        } else {
          data = await RequestService.getMyRequests(user.id);
        }
        setRequests(data);
      } catch (err) {
        console.error('Failed to fetch requests', err);
      }
    };

    fetchRequests();

    const channel = supabase.channel('requests-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'requests' }, () => {
        fetchRequests(); // Reload requests on any change
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const addRequest = async (requestData: Omit<Request, 'id' | 'status' | 'created_at' | 'updated_at'>) => {
    if (!import.meta.env.VITE_SUPABASE_URL) {
      const newRequest: Request = {
        ...requestData,
        id: `req-${Date.now()}`,
        status: 'submitted',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setRequests((prev) => [newRequest, ...prev]);
      return;
    }
    
    // In live mode, NewRequest component uses RequestService directly, but if this is called:
    await RequestService.createRequest({ ...requestData, status: 'submitted' } as Omit<Request, 'id' | 'created_at' | 'updated_at'>);
  };

  const updateRequestStatus = async (id: string, status: RequestStatus, volunteerId?: string) => {
    // Optimistic UI Update for both live and mock modes
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? { ...req, status, ...(volunteerId ? { volunteer_id: volunteerId } : {}) }
          : req
      )
    );

    if (!import.meta.env.VITE_SUPABASE_URL) {
      return;
    }

    try {
      await RequestService.updateRequestStatus(id, status, volunteerId);
    } catch (error) {
      console.error('Failed to update request status', error);
      // We could revert the optimistic update here on failure
    }
  };

  return (
    <RequestsContext.Provider value={{ requests, addRequest, updateRequestStatus }}>
      {children}
    </RequestsContext.Provider>
  );
};

export const useRequests = () => {
  const context = useContext(RequestsContext);
  if (context === undefined) {
    throw new Error('useRequests must be used within a RequestsProvider');
  }
  return context;
};
