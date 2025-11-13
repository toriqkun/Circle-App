import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft, Image as ImageIcon, MessageSquareText, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import api from "../utils/axios";
import ReplyItem from "../components/ReplyItem";
import type { Thread, Reply } from "../models/Thread";
import { useAppSelector } from "../store/hooks";
import { useThreads } from "../context/ThreadContext";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  updateThread as updateThreadService,
  deleteThread,
  replyThread as replyThreadService,
  likeThread as likeThreadService,
  replyToReply as replyToReplyService,
  likeReply as likeReplyService,
} from "../services/threadService";
import EditPostModal from "../components/EditPostModal";

const socket = io("http://localhost:5000", { transports: ["websocket"] });

function removeReplyRecursive(replies: Reply[] | undefined, replyId: string): Reply[] {
  if (!replies) return [];
  return replies
    .filter((r) => r.id !== replyId)
    .map((r) => ({
      ...r,
      children: removeReplyRecursive(r.children, replyId),
    }));
}

export default function ThreadDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const authUser = useAppSelector((s) => s.auth.user);
  const { updateThread: ctxUpdateThread, removeThread, addChildReply } = useThreads();

  const [thread, setThread] = useState<Thread | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState("");
  const [replyImage, setReplyImage] = useState<File | null>(null);

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetch = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/threads/${id}`);
        setThread(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();

    socket.on("thread:reply", ({ threadId, reply, replies_count }) => {
      if (threadId === id) {
        setThread((t) =>
          t
            ? {
                ...t,
                replies: [reply, ...(t.replies || [])],
                replies_count,
              }
            : t
        );
      }
    });

    socket.on("thread:like", ({ threadId, likes, likedUserIds }) => {
      if (threadId === id) {
        setThread((t) =>
          t
            ? {
                ...t,
                likes,
                isLiked: likedUserIds.includes(authUser?.id || ""),
              }
            : t
        );
      }
    });

    socket.on("reply:like", ({ threadId, replyId, likes, likedUserIds }) => {
      if (threadId === id) {
        setThread((t) =>
          t
            ? {
                ...t,
                replies:
                  t.replies?.map((r) =>
                    r.id === replyId
                      ? {
                          ...r,
                          likes,
                          isLiked: likedUserIds.includes(authUser?.id || ""),
                        }
                      : r
                  ) || [],
              }
            : t
        );
      }
    });

    socket.on("reply:nested", ({ threadId, parentId, reply }) => {
      if (threadId === id) {
        setThread((prev) =>
          prev
            ? {
                ...prev,
                replies_count: (prev.replies_count || 0) + 1,
              }
            : prev
        );
        addChildReply(threadId, parentId, reply);
      }
    });

    return () => {
      socket.off("thread:reply");
      socket.off("thread:like");
      socket.off("reply:like");
      socket.off("reply:nested");
    };
  }, [id, authUser?.id, addChildReply ]);

  const handleReply = async () => {
    if (!id) return;
    if (!replyContent.trim() && !replyImage) return;

    const formData = new FormData();
    formData.append("content", replyContent);
    if (replyImage) formData.append("image", replyImage);

    try {
      const res = await replyThreadService(id, formData);
      if (res.status === "success") {
        setReplyContent("");
        setReplyImage(null);
      } else {
        alert(res.message || "Reply failed");
      }
    } catch (err) {
      console.error("❌ reply:", err);
      alert("Failed to post reply");
    }
  };

  const handleDeletedReply = (replyId: string) => {
    setThread((prev) =>
      prev
        ? {
            ...prev,
            replies: removeReplyRecursive(prev.replies, replyId),
            replies_count: (prev.replies_count || 1) - 1,
          }
        : prev
    );
  };

  const handleDelete = async () => {
    if (!thread || authUser?.id !== thread.user?.id) {
      alert("Invalid action.");
      return;
    }
    if (!confirm("Delete this thread?")) return;

    try {
      await deleteThread(thread.id);
      removeThread(thread.id);
      navigate("/");
    } catch (err) {
      console.error("❌ Delete error:", err);
      alert("Failed to delete thread");
    }
  };

  const handleLike = async () => {
    try {
      const res = await likeThreadService(thread!.id);
      if (res.status === "success") {
        setThread((t) =>
          t
            ? {
                ...t,
                likes: res.data.likes,
                isLiked: res.data.likedUserIds.includes(authUser?.id || ""),
              }
            : t
        );
      }
    } catch (err) {
      console.error("❌ like thread:", err);
    }
  };

  const handleLikeReply = async (replyId: string) => {
    try {
      const res = await likeReplyService(thread!.id, replyId);
      setThread((prev) =>
        prev
          ? {
              ...prev,
              replies:
                prev.replies?.map((r) =>
                  r.id === replyId
                    ? {
                        ...r,
                        likes: res.data.likes,
                        isLiked: res.data.likedUserIds.includes(authUser?.id || ""),
                      }
                    : r
                ) || [],
            }
          : prev
      );
    } catch (err) {
      console.error("❌ likeReply FE:", err);
    }
  };

  const handleReplyToReply = async (parentId: string, content: string) => {
    if (!thread) return;
    try {
      const res = await replyToReplyService(thread.id, parentId, content);
      const newReply = res.reply;
      setThread((prev) =>
        prev
          ? {
              ...prev,
              replies: prev.replies ? prev.replies.map((r) => (r.id === parentId ? { ...r, children: [newReply, ...(r.children || [])] } : r)) : [],
              replies_count: res.replies,
            }
          : prev
      );
    } catch (err) {
      console.error("❌ replyToReply error:", err);
      alert("Failed to reply");
    }
  };

  if (loading) return <div className="text-white p-4">Loading...</div>;
  if (!thread) return <div className="text-white p-4">Thread not found</div>;

  const canModifyThread = authUser?.id === thread.user?.id;

  return (
    <div className="text-white border-x border-gray-600 mx-auto min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-5 p-4">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white">
          <ArrowLeft className="w-7 h-7" />
        </button>
        <h2 className="text-3xl font-semibold">Status</h2>
      </div>

      {/* Thread */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex gap-4">
          <Avatar className="w-12 h-12 cursor-pointer">
            <AvatarImage src={thread.user?.photo_profile || "/default-avatar.png"} />
            <AvatarFallback>{thread.user?.full_name?.[0] || "U"}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-lg">{thread.user?.full_name}</p>
                <p className="text-gray-500 text-md">@{thread.user?.username}</p>
              </div>

              {canModifyThread && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-gray-400">
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-black border border-gray-700">
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <p className="text-white flex items-center">
                        <Pencil className="w-4 h-4 mr-2" /> Edit
                      </p>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDelete}>
                      <p className="text-white flex items-center">
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </p>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>

        {/* Edit modal */}
        {isEditing && (
          <EditPostModal
            initialContent={thread.content}
            initialImage={thread.image}
            onSave={async (newContent, newImage) => {
              const formData = new FormData();
              formData.append("content", newContent);
              if (newImage) {
                formData.append("image", newImage);
              }

              const res = await updateThreadService(thread.id, formData);
              if (res.status === "success") {
                ctxUpdateThread(thread.id, {
                  content: res.data.content,
                  image: res.data.image,
                });
                setIsEditing(false);
              } else {
                alert(res.message || "Failed to update thread");
              }
            }}
            onClose={() => setIsEditing(false)}
          />
        )}

        <div className="px-4">
          <p className="mt-3 px-2 whitespace-pre-wrap">{thread.content}</p>
          {thread.image && <img src={thread.image} alt="thread" className="mt-2 rounded-xl border border-gray-700 max-w-[800px] max-h-[400px]" />}

          <div className="flex gap-2 mt-3 items-center">
            <Button variant="ghost" size="sm" onClick={handleLike} className={`flex items-center gap-1 ${thread.isLiked ? "text-red-500" : "text-gray-500 hover:text-red-400"}`}>
              <Heart className={`w-4 h-4 ${thread.isLiked ? "fill-red-500" : ""}`} />
              <span>{thread.likes}</span>
            </Button>
            <span className="flex items-center gap-1 text-gray-400">
              <MessageSquareText className="w-4 h-4" />
              {(thread.replies_count || 0) === 0 ? "Reply" : `${thread.replies_count} Replies`}
            </span>
          </div>
        </div>
      </div>

      {/* Reply box */}
      <div className="p-4 flex gap-[18px] items-start border-b border-gray-700">
        <Avatar className="w-10 h-10">
          <AvatarImage src={authUser?.photo_profile || "/default-avatar.png"} />
          <AvatarFallback>{authUser?.full_name?.[0] || "U"}</AvatarFallback>
        </Avatar>

        <div className="flex-1 flex flex-col gap-2">
          <input
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder={`Comment as ${authUser?.username}...`}
            className="w-full text-white py-2 px-3 rounded resize-none outline-none placeholder-gray-400 border border-gray-600 bg-black"
          />

          {replyImage && (
            <div className="relative w-fit mt-1">
              <img src={URL.createObjectURL(replyImage)} alt="preview" className="max-h-24 rounded-lg border border-gray-700" />
              <button type="button" onClick={() => setReplyImage(null)} className="absolute top-1 right-1 bg-black/70 text-white rounded-full px-[4px] text-sm hover:bg-black">
                ✕
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center mt-[2.5px] gap-2">
          <label className="cursor-pointer text-green-600 hover:text-green-500">
            <ImageIcon size={25} />
            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0] || null;
                setReplyImage(f);
                e.currentTarget.value = "";
              }}
            />
          </label>
          <Button onClick={handleReply} className="bg-green-600 hover:bg-green-700">
            Reply
          </Button>
        </div>
      </div>

      {/* Replies list */}
      <div className="flex flex-col gap-4">
        {thread.replies?.map((r) => (
          <ReplyItem key={r.id} reply={r} onLike={handleLikeReply} onReply={handleReplyToReply} onDeleted={handleDeletedReply} />
        ))}
      </div>
    </div>
  );
}
