import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import ThreadCard from "../components/ThreadCard";
import type { Thread } from "../models/Thread";
import { fetchThreads } from "../services/threadService";
import CreatePostModal from "../components/CreatePostModal";
import CreatePostBox from "../components/CreatePostBox";
import { useThreads } from "../context/ThreadContext";
import { useAppSelector } from "../store/hooks";

const socket = io("http://localhost:5000", { transports: ["websocket"] });

export default function Home() {
  const authUser = useAppSelector((state) => state.auth.user);
  const { threads, setThreads } = useThreads();
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const loadThreads = async () => {
      try {
        const data = await fetchThreads();
        setThreads(data);
      } catch (err) {
        console.error("❌ Error fetching threads:", err);
      } finally {
        setLoading(false);
      }
    };

    loadThreads();

    socket.on("connect", () => {
      console.log("🔌 Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    socket.on("thread:new", (newThread: Thread) => {
      setThreads((prev) => [newThread, ...prev]);
    });

    socket.on("thread:like", ({ threadId, likes, likedUserIds }) => {
      setThreads((prev) =>
        prev.map((t) =>
          t.id === threadId
            ? {
                ...t,
                likes,
                isLiked: likedUserIds.includes(authUser?.id || ""),
              }
            : t
        )
      );
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("thread:new");
      socket.off("thread:like");
    };
  }, []);

  if (loading) {
    return <div className="text-white p-4">Loading threads...</div>;
  }

  return (
    <main className="flex-1 border-x border-gray-800">
      {/* Header */}
      <div className="p-4">
        <h1 className="text-xl font-bold">Home</h1>
      </div>

      {/* PostBox trigger (open modal on click) */}
      <CreatePostBox />

      {/* List Threads */}
      {threads.length === 0 ? (
        <p className="text-gray-500 text-center p-6">No threads yet</p>
      ) : (
        <div className="flex flex-col divide-y divide-gray-800">
          {threads.map((thread) => (
            <ThreadCard key={thread.id} thread={thread} />
          ))}
        </div>
      )}

      {/* Modal Create Post */}
      <CreatePostModal open={openModal} onClose={() => setOpenModal(false)} />
    </main>
  );
}
