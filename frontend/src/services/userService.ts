import api from "../utils/axios";

// Ambil semua user
export const fetchUsers = async () => {
  const res = await api.get("/api/users");
  return res.data.data;
};

// Suggested users
export const getSuggestedUsers = async () => {
  const token = localStorage.getItem("token") || "";
  const res = await api.get("/users/suggested", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};

// Ambil profile user berdasarkan username
export const getUserProfile = async (username: string) => {
  const res = await api.get(`/users/${username}`);
  return res.data.data;
};

// Ambil thread milik user
export const getUserThreads = async (username: string) => {
  const res = await api.get(`/users/${username}/threads`);
  return res.data.data.threads;
};

// Update profile user
export const updateUserProfile = async (formData: FormData) => {
  const res = await api.put("/users/update", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};

export const getUserByUsername = async (username: string) => {
  const res = await api.get(`/users/${username}`);
  console.log("RAW USER RES:", res.data);
  return res.data.data || null;
};
