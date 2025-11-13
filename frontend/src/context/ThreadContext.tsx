import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Thread, Reply } from "../models/Thread";
import socket from "../services/socket";
import { useAppSelector } from "../store/hooks";

interface ThreadContextType {
  threads: Thread[];
  setThreads: React.Dispatch<React.SetStateAction<Thread[]>>;
  updateThread: (id: string, updates: Partial<Thread> | ((prev: Thread) => Partial<Thread>)) => void;
  updateReply: (threadId: string, replyId: string, data: Partial<Reply>) => void;
  addReply: (threadId: string, reply: Reply) => void;
  addChildReply: (threadId: string, parentId: string, reply: Reply) => void;
  removeThread: (id: string) => void;
  removeReply: (threadId: string, replyId: string) => void;
}

const ThreadContext = createContext<ThreadContextType | undefined>(undefined);

export const ThreadProvider = ({ children }: { children: ReactNode }) => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const authUser = useAppSelector((s) => s.auth.user);

  const updateThread = (id: string, updates: Partial<Thread> | ((prev: Thread) => Partial<Thread>)) => {
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const newUpdates = typeof updates === "function" ? updates(t) : updates;
        return { ...t, ...newUpdates };
      })
    );
  };

  const updateReplyRecursive = (replies: Reply[] = [], replyId: string, data: Partial<Reply>): Reply[] => {
    return replies.map((r) => (r.id === replyId ? { ...r, ...data } : { ...r, children: updateReplyRecursive(r.children || [], replyId, data) }));
  };

  const updateReply = (threadId: string, replyId: string, data: Partial<Reply>) => {
    setThreads((prev) => prev.map((t) => (t.id === threadId ? { ...t, replies: updateReplyRecursive(t.replies, replyId, data) } : t)));
  };

  const addReply = (threadId: string, reply: Reply) => {
    setThreads((prev) => prev.map((t) => (t.id === threadId ? { ...t, replies: [...(t.replies || []), reply] } : t)));
  };

  const addChildReplyRecursive = (replies: Reply[] = [], parentId: string, reply: Reply): Reply[] => {
    return replies.map((r) =>
      r.id === parentId
        ? {
            ...r,
            replies_count: (r.replies_count || 0) + 1,
            children: [...(r.children || []), reply],
          }
        : { ...r, children: addChildReplyRecursive(r.children || [], parentId, reply) }
    );
  };

  const addChildReply = (threadId: string, parentId: string, reply: Reply) => {
    setThreads((prev) => prev.map((t) => (t.id === threadId ? { ...t, replies: addChildReplyRecursive(t.replies, parentId, reply) } : t)));
  };

  const removeThread = (id: string) => {
    setThreads((prev) => prev.filter((t) => t.id !== id));
  };

  const removeReplyRecursive = (replies: Reply[] = [], replyId: string): Reply[] => {
    return replies.filter((r) => r.id !== replyId).map((r) => ({ ...r, children: removeReplyRecursive(r.children || [], replyId) }));
  };

  const removeReply = (threadId: string, replyId: string) => {
    setThreads((prev) => prev.map((t) => (t.id === threadId ? { ...t, replies: removeReplyRecursive(t.replies, replyId) } : t)));
  };

  useEffect(() => {
    socket.on("thread:like", ({ threadId, likes, likedUserIds }) => {
      updateThread(threadId, {
        likes,
        isLiked: likedUserIds.includes(authUser?.id || ""),
      });
    });

    socket.on("reply:like", ({ threadId, replyId, likes, likedUserIds }) => {
      updateReply(threadId, replyId, {
        likes,
        isLiked: likedUserIds.includes(authUser?.id || ""),
      });
    });

    socket.on("thread:reply", ({ threadId, reply, replies_count }) => {
      updateThread(threadId, { replies_count });
      addReply(threadId, reply);
    });

    socket.on("reply:nested", ({ threadId, parentId, reply }) => {
      updateThread(threadId, (prev) => ({
        replies_count: (prev.replies_count || 0) + 1,
      }));
      addChildReply(threadId, parentId, reply);
    });

    return () => {
      socket.off("thread:like");
      socket.off("reply:like");
      socket.off("thread:reply");
      socket.off("reply:nested");
    };
  }, []);

  return <ThreadContext.Provider value={{ threads, setThreads, updateThread, updateReply, addReply, addChildReply, removeReply, removeThread }}>{children}</ThreadContext.Provider>;
};

export const useThreads = () => {
  const context = useContext(ThreadContext);
  if (!context) throw new Error("useThreads must be used within ThreadProvider");
  return context;
};
