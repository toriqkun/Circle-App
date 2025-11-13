import api from "../utils/axios";

// Follow user
export const followUser = async (targetUserId: string) => {
  const res = await api.post("/follows", { target_user_id: targetUserId });
  return res.data;
};

// Unfollow user
export const unfollowUser = async (targetUserId: string) => {
  const res = await api.delete(`/follows/${targetUserId}`);
  return res.data;
};

export const searchUsers = async (query: string) => {
  const res = await api.get(`/search/users?q=${query}`);
  return res.data.data || [];
};

export const fetchFollows = async (token: string, type: "followers" | "following") => {
  const res = await fetch(`http://localhost:5000/api/v1/follows?type=${type}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (json.status === "success") return json.data;
  return [];
};
