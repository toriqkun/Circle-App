import type { User } from "./User";

export interface Reply {
  id: string;
  content: string;
  image?: string | null;
  created_at: string;
  user: User | null;
  likes: number;
  isLiked: boolean;
  children?: Reply[];
  replies_count?: number;
}

export interface Thread {
  id: string;
  content: string;
  image?: string | null;
  created_at: string;
  likes: number;
  replies_count: number;
  isLiked: boolean;
  user: User | null;
  replies?: Reply[];
}