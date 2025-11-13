import axios from "axios";

export async function fetchThreads(limit: number, token: string) {
  const res = await axios.get(`http://localhost:5000/api/v1/threads?limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data.threads;
}

