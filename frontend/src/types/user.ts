export interface User {
  id: string;
  username: string;
  full_name: string;
  email: string;
  photo_profile?: string | null;
  bio?: string | null;
}
