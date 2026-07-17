export type UserRole = 'requester' | 'volunteer' | 'admin';
export type RequestCategory = 'grocery' | 'medication' | 'companionship' | 'other';
export type RequestPriority = 'low' | 'normal' | 'high' | 'urgent';
export type RequestStatus = 'draft' | 'submitted' | 'pending' | 'assigned' | 'traveling' | 'arrived' | 'in_progress' | 'completed' | 'cancelled';
export type AvailabilityStatus = 'available' | 'busy' | 'offline';

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  verified: boolean;
  rating: number;
  completed_tasks: number;
  emergency_contact: any | null;
  bio: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  availability_status: AvailabilityStatus;
  impact_score: number;
  created_at: string;
  updated_at: string;
}

export interface Request {
  id: string;
  requester_id: string;
  volunteer_id: string | null;
  category: RequestCategory;
  title: string;
  description: string;
  priority: RequestPriority;
  status: RequestStatus;
  preferred_time: string | null;
  address: string;
  latitude: number | null;
  longitude: number | null;
  special_instructions: string | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  request_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

// Database schema representation for Supabase Client
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
      requests: {
        Row: Request;
        Insert: Omit<Request, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Request, 'id' | 'created_at' | 'updated_at'>>;
      };
      messages: {
        Row: Message;
        Insert: Omit<Message, 'id' | 'created_at' | 'is_read'>;
        Update: Partial<Omit<Message, 'id' | 'created_at'>>;
      };
    };
  };
}
