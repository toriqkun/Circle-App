import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquareText, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import type { Reply } from "../models/Thread";
import { updateReplyText, updateReplyWithFile, deleteReply as deleteReplyService } from "../services/threadService";
import { useAppSelector } from "../store/hooks";
import EditReplyModal from "./EditReplyModal";
import EditChildReplyModal from "./EditChildReplyModal";

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

type Props = {
  reply: Reply;
  onLike?: (replyId: string) => void;
  onReply?: (replyId: string, content: string) => void;
  onUpdated?: (updated: Reply) => void;
  onDeleted?: (id: string) => void;
  isChild?: boolean;
};

export default function ReplyItem({ reply, onLike, onReply, onUpdated, onDeleted, isChild = false }: Props) {
  const authUser = useAppSelector((s) => s.auth.user);
  const [nestedReply, setNestedReply] = useState("");
  const [showReplies, setShowReplies] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const canModify = authUser?.id === reply.user?.id;

  const handleDelete = async () => {
    if (!canModify) return;
    if (!confirm("Delete this reply?")) return;
    try {
      setLoading(true);
      const res = await deleteReplyService(reply.id);
      if (res.status === "success") {
        onDeleted?.(reply.id);
      }
    } catch (err) {
      console.error("❌ delete reply:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNested = () => {
    if (!nestedReply.trim()) return;
    onReply?.(reply.id, nestedReply);
    setNestedReply("");
    setShowReplies(true);
  };

  return (
    <div className={`flex gap-5 p-4 ${isChild ? "mt-2" : "border-b border-gray-800 pb-3"}`}>
      <Avatar className="w-12 h-12 cursor-pointer">
        <AvatarImage src={reply.user?.photo_profile || "/default-avatar.png"} />
        <AvatarFallback>{reply.user?.full_name?.[0] || "U"}</AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <div className="flex items-start  justify-between gap-2">
          <div className="flex gap-2 items-center">
            <span className="font-bold text-md">{reply.user?.full_name}</span>
            <span className="text-gray-500 text-md">@{reply.user?.username}</span>
            <span className="text-gray-500">• {formatThreadDate(reply.created_at)}</span>
          </div>
        </div>

        {showEditModal && !isChild && (
          <EditReplyModal
            initialContent={reply.content}
            initialImage={reply.image}
            loading={loading}
            onSave={async (newContent, newImage) => {
              try {
                setLoading(true);
                const formData = new FormData();
                formData.append("content", newContent);
                if (newImage) {
                  formData.append("image", newImage);
                }

                const res = await updateReplyWithFile(reply.id, formData);
                if (res.status === "success") {
                  onUpdated?.(res.data);
                  setShowEditModal(false);
                }
              } catch (err) {
                console.error("❌ update reply:", err);
              } finally {
                setLoading(false);
              }
            }}
            onClose={() => setShowEditModal(false)}
          />
        )}

        {showEditModal && isChild && (
          <EditChildReplyModal
            initialContent={reply.content}
            loading={loading}
            onSave={async (newContent) => {
              try {
                setLoading(true);
                const res = await updateReplyText(reply.id, { content: newContent });
                if (res.status === "success") {
                  onUpdated?.(res.data);
                  setShowEditModal(false);
                }
              } catch (err) {
                console.error("❌ update child reply:", err);
              } finally {
                setLoading(false);
              }
            }}
            onClose={() => setShowEditModal(false)}
          />
        )}
        <>
          <p className="mt-[3px] whitespace-pre-wrap">{reply.content}</p>
          {reply.image && !isChild && <img src={reply.image} alt="reply" className="mt-2 rounded-lg border border-gray-700 max-w-[400px] max-h-[270px]" />}
          {!isChild && (
            <div className="flex gap-3 mt-2 text-sm text-gray-400 items-center">
              <button onClick={() => onLike?.(reply.id)} className={`flex items-center gap-1 ${reply.isLiked ? "text-red-500" : "hover:text-red-400"}`}>
                <Heart className={`w-4 h-4 ${reply.isLiked ? "fill-red-500" : ""}`} />
                <span>{reply.likes}</span>
              </button>
              <button onClick={() => setShowReplies((s) => !s)} className="flex items-center gap-1 hover:text-green-400">
                <MessageSquareText className="w-4 h-4" />
                <span>{reply.children?.length ? `${reply.children.length} Replies` : "Reply"}</span>
              </button>
            </div>
          )}
          {showReplies && !isChild && (
            <div className="mt-3 space-y-3">
              <div className="flex gap-2">
                <input
                  value={nestedReply}
                  onChange={(e) => setNestedReply(e.target.value)}
                  placeholder={`Reply to ${reply.user?.username}...`}
                  className="flex-1 text-white bg-black border border-gray-600 rounded px-2 py-1"
                />
                <Button onClick={handleAddNested} disabled={!nestedReply.trim()} className="bg-green-600 hover:bg-green-700">
                  Reply
                </Button>
              </div>
              {reply.children && (
                <div className="ml-6 mt-2 flex flex-col gap-3">
                  {reply.children.map((child) => (
                    <ReplyItem key={child.id} reply={child} onLike={onLike} onReply={onReply} onUpdated={onUpdated} onDeleted={onDeleted} isChild />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="text-gray-400">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-black border border-gray-700">
          <DropdownMenuItem onClick={() => canModify && setShowEditModal(true)}>
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
    </div>
  );
}
