export interface SignupPayload {
  email: string;
  password?: string; // Optional if using magic links later
  fullName: string;
  role: 'requester' | 'volunteer';
  phone?: string;
  address?: string;
}

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface UserSession {
  id: string;
  email: string;
}
