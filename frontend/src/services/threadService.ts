import api from "../utils/axios";
import type { Thread, Reply } from "../models/Thread";

// GET threads
export const fetchThreads = async (): Promise<Thread[]> => {
  const res = await api.get("/threads");
  return res.data.data.threads as Thread[];
};

// CREATE thread
export async function createThread(formData: FormData): Promise<Thread> {
  const res = await api.post("/threads", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data.data as Thread;
}

// GET thread by id (with replies)
export async function getThreadById(id: string): Promise<Thread> {
  const res = await api.get(`/threads/${id}`);
  return res.data.data as Thread;
}

// LIKE thread
export async function likeThread(threadId: string) {
  const res = await api.post(`/threads/${threadId}/like`);
  return {
    status: res.data.status,
    message: res.data.message,
    data: res.data.data,
  };
}

// REPLY thread
export async function replyThread(threadId: string, formData: FormData) {
  const res = await api.post(`/threads/${threadId}/reply`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return {
    status: res.data.status,
    message: res.data.message,
    data: res.data.data.reply,
  };
}

// LIKE reply
export async function likeReply(threadId: string, replyId: string) {
  const res = await api.post(`/threads/${threadId}/replies/${replyId}/like`);
  return {
    status: res.data.status,
    message: res.data.message,
    data: res.data.data,
  };
}

// REPLY to reply (nested reply)
export async function replyToReply(threadId: string, replyId: string, content: string): Promise<{ reply: Reply; replies: number }> {
  const res = await api.post(`/threads/${threadId}/replies/${replyId}/reply`, { content });
  return res.data.data as { reply: Reply; replies: number };
}

// GET all threads by username
export async function getThreadsByUser(username: string): Promise<Thread[]> {
  const res = await api.get(`/users/${username}/threads`);
  return res.data.data as Thread[];
}

export async function deleteThread(threadId: string) {
  const res = await api.delete(`/threads/${threadId}`);
  return {
    status: res.data.status,
    message: res.data.message,
  };
}

export async function updateThread(threadId: string, payload: { content: string; image?: File | null } | FormData) {
  let res;

  if (payload instanceof FormData) {
    res = await api.put(`/threads/${threadId}`, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } else {
    res = await api.put(`/threads/${threadId}`, payload);
  }

  return {
    status: res.data.status,
    message: res.data.message,
    data: res.data.data,
  };
}

export async function updateReplyText(replyId: string, payload: { content: string }) {
  const res = await api.put(`/replies/${replyId}/update`, payload);
  return {
    status: res.data.status,
    message: res.data.message,
    data: res.data.data,
  };
}

export async function updateReplyWithFile(replyId: string, formData: FormData) {
  const res = await api.put(`/replies/${replyId}/update`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return {
    status: res.data.status,
    message: res.data.message,
    data: res.data.data,
  };
}

export async function deleteReply(replyId: string) {
  const res = await api.delete(`/replies/${replyId}/delete`);
  return {
    status: res.data.status,
    message: res.data.message,
  };
}
