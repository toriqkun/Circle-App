export interface User {
  id: string;
  full_name: string;
  username: string;
  email: string;
  photo_profile?: string | null;
  photo_sampul?: string | null;
  bio?: string | null;
  followingCount: number;
  followerCount: number;
}
