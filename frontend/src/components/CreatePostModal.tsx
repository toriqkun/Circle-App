import { useState } from "react";
import { X, Image } from "lucide-react";
import { createThread } from "../services/threadService";
import type { Thread } from "../models/Thread";
import { useAppSelector } from "../store/hooks";

interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (thread: Thread) => void;
}

export default function CreatePostModal({ open, onClose }: CreatePostModalProps) {
  const user = useAppSelector((s) => s.auth.user);
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("content", content);
      if (image) formData.append("image", image);

      await createThread(formData);
      console.log("✅ Thread request sent, waiting for socket update...");

      setContent("");
      setImage(null);
      onClose();
    } catch (err) {
      console.error("❌ Error creating thread:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-[#111111] rounded-2xl w-[500px] p-4 text-white relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white">
          <X size={20} />
        </button>

        <div className="flex gap-3 mt-2 border-b border-gray-500">
          <img src={user?.photo_profile || "/default-avatar.png"} alt={user?.full_name || "avatar"} className="w-10 h-10 rounded-full object-cover" />

          <div className="flex-1">
            <textarea
              className="w-full bg-transparent resize-none outline-none text-white placeholder-gray-500 text-lg pr-4"
              rows={4}
              placeholder="What is happening?!"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            {image && (
              <div className="mt-3">
                <div className="relative inline-block">
                  <img src={URL.createObjectURL(image)} alt="preview" className="rounded-lg max-h-60 object-contain" />
                  <button onClick={() => setImage(null)} className="absolute top-1 right-1 bg-black/70 rounded-full p-1 hover:bg-black">
                    <X size={16} className="text-white" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-4 px-3">
          {/* Upload */}
          <label className="cursor-pointer text-green-600 hover:text-green-500 flex items-center gap-2">
            <Image size={25} />
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>

          <button onClick={handleSubmit} disabled={loading || !content.trim()} className="bg-green-600 text-white px-5 py-1.5 rounded-full font-medium hover:bg-green-700 disabled:opacity-50">
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
