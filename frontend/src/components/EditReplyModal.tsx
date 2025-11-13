import { X, ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";

interface EditReplyModalProps {
  initialContent: string;
  initialImage?: string | null;
  onSave: (content: string, image?: File | null) => void;
  onClose: () => void;
  loading?: boolean;
}

export default function EditReplyModal({ initialContent, initialImage, onSave, onClose, loading }: EditReplyModalProps) {
  const [content, setContent] = useState(initialContent);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(initialImage || null);

  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [image]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
  };

  const handleSave = () => {
    onSave(content, image);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-[#111111] rounded-2xl w-[500px] p-4 text-white relative">
        {/* Close button */}
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white">
          <X size={20} />
        </button>

        {/* Textarea */}
        <textarea className="w-full bg-transparent resize-none outline-none text-white placeholder-gray-500 text-lg pr-4" rows={4} value={content} onChange={(e) => setContent(e.target.value)} />

        {/* Preview image */}
        {preview && (
          <div className="mt-3">
            <div className="relative inline-block">
              <img src={preview} alt="preview" className="rounded-lg max-h-30 object-contain" />
              <button type="button" onClick={handleRemoveImage} className="absolute top-1 right-1 bg-black/70 rounded-full p-1 hover:bg-black">
                <X size={16} className="text-white" />
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center border-t border-gray-700 pt-4">
          {/* Upload button */}
          <label className="cursor-pointer text-green-500 hover:text-green-400 flex items-center gap-2">
            <ImageIcon size={25} />
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button onClick={onClose} className="text-white px-5 py-1.5 rounded font-medium hover:bg-[#202020] border border-gray-400">
              Cancel
            </button>
            <button onClick={handleSave} disabled={loading || !content.trim()} className="bg-green-600 text-white px-5 py-1.5 rounded font-medium hover:bg-green-700 disabled:opacity-50">
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
