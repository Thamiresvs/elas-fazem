export interface Provider {
  id: string;
  full_name: string;
  avatar_url: string;
  category: string;
  bio: string;
  rating: number;
  hourly_rate: number;
  distance_km: number;
}

export interface ChatMessage {
  id?: string;
  chat_id?: string;
  sender_id?: string;
  sender_name?: string;
  is_me?: boolean;
  content: string;
  created_at?: string;
  time?: string;
}
