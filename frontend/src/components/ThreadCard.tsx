import { MessageSquareText, Heart, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { Thread } from "../models/Thread";
import { likeThread, deleteThread, updateThread as updateThreadService } from "../services/threadService";
import { useThreads } from "../context/ThreadContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import EditPostModal from "./EditPostModal";

interface ThreadCardProps {
  thread: Thread;
}

function formatThreadDate(createdAt: string) {
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now.getTime() - created.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 60) return `${diffMinutes || 1}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 30) return `${diffDays}d`;

  return created.toLocaleDateString("en-GB");
}

export default function ThreadCard({ thread }: ThreadCardProps) {
  const navigate = useNavigate();
  const { updateThread: ctxUpdateThread, removeThread } = useThreads();
  const authUser = useAppSelector((state) => state.auth.user);

  const [isEditing, setIsEditing] = useState(false);

  const handleLike = async () => {
    try {
      const res = await likeThread(thread.id);
      if (res.status === "success") {
        ctxUpdateThread(res.data.threadId, {
          likes: res.data.likes,
          isLiked: res.data.likedUserIds.includes(authUser?.id || ""),
        });
      }
    } catch (err) {
      console.error("❌ Like error:", err);
    }
  };

  const goToProfile = () => {
    if (!thread.user) return;
    if (thread.user.id === authUser?.id) {
      navigate("/profile");
    } else {
      navigate(`/profile/${thread.user.username}`);
    }
  };

  const handleDelete = async () => {
    if (authUser?.id !== thread.user?.id) {
      alert("Invalid action.");
      return;
    }
    if (!confirm("Delete this thread?")) return;

    try {
      await deleteThread(thread.id);
      removeThread(thread.id);
    } catch (err) {
      console.error("❌ Delete error:", err);
      alert("Failed to delete thread");
    }
  };

  return (
    <Card className="bg-black border-gray-800">
      <CardContent className="flex gap-4 p-4 flex-col">
        <div className="flex gap-4">
          {/* Avatar */}
          <Avatar className="w-10 h-10 cursor-pointer" onClick={goToProfile}>
            <AvatarImage src={thread.user?.photo_profile || "/default-avatar.png"} alt={thread.user?.full_name || "User"} />
            <AvatarFallback>{thread.user?.full_name?.[0] || "U"}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-white text-lg cursor-pointer" onClick={goToProfile}>
                  {thread.user?.full_name || "Unknown"}
                </span>
                <span className="text-gray-500 hover:text-white text-md cursor-pointer" onClick={goToProfile}>
                  @{thread.user?.username || "unknown"}
                </span>
                <span className="text-gray-500">• {formatThreadDate(thread.created_at)}</span>
              </div>

              {/* Menu */}
              {authUser?.id === thread.user?.id && (
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

            {/* Content */}
            <p className="mt-1 text-gray-200 whitespace-pre-wrap">{thread.content}</p>
            {thread.image && <img src={thread.image} alt="thread" className="mt-3 rounded-xl border border-gray-700 max-w-[550px] max-h-[400px] object-contain" />}

            {/* Actions */}
            <div className="flex justify-between mt-3 text-sm">
              <div className="flex gap-0">
                <Button variant="ghost" size="sm" onClick={handleLike} className={`flex items-center gap-1 ${thread.isLiked ? "text-red-500" : "text-gray-500 hover:text-red-400"}`}>
                  <Heart className={`w-4 h-4 ${thread.isLiked ? "fill-red-500" : ""}`} />
                  <span>{thread.likes}</span>
                </Button>

                <Button variant="ghost" size="sm" onClick={() => navigate(`/thread/${thread.id}`)} className="flex items-center gap-1 text-gray-500 hover:text-green-400">
                  <MessageSquareText className="w-4 h-4" />
                  <span>{thread.replies_count ? `${thread.replies_count} Replies` : "Reply"}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
