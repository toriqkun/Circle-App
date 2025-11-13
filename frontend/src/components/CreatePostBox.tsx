import { Image, X } from "lucide-react";
import { useState, useRef } from "react";
import { createThread } from "../services/threadService";
import { useAppSelector } from "../store/hooks";

export default function CreatePostBox() {
  const user = useAppSelector((s) => s.auth.user);
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handlePost = async () => {
    if (!content.trim() && !image) return;
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("content", content.trim());
      if (image) formData.append("image", image);

      await createThread(formData);
      setContent("");
      setImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("❌ Error create thread:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-start gap-4 px-4 py-3 border-b border-gray-800">
      {/* Avatar */}
      <img
        src={user?.photo_profile || "/default-avatar.png"}
        alt={user?.full_name || "avatar"}
        className="w-10 h-10 rounded-full mt-1 object-cover"
      />

      {/* Input + Preview */}
      <div className="flex-1 flex items-start gap-4">
        <div className="flex-1 flex flex-col">
          {/* Input */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What is happening?!"
            rows={image ? 3 : 1}
            className="w-full bg-transparent p-2 outline-none text-white text-lg resize-none"
          />

          {/* Preview Image */}
          {image && (
            <div className="relative mt-3 w-fit">
              <img src={URL.createObjectURL(image)} alt="preview" className="max-h-40 rounded-lg border border-gray-700" />
              <button
                type="button"
                onClick={() => {
                  setImage(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 hover:bg-black"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <label className="cursor-pointer text-green-600 hover:text-green-500">
            <Image size={20} />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setImage(file);
              }}
            />
          </label>

          <button onClick={handlePost} disabled={loading || (!content.trim() && !image)} className="bg-green-600 text-white px-4 py-1.5 rounded-full hover:bg-green-700 disabled:opacity-50">
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
