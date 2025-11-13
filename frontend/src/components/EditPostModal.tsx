import { X, Image as ImageIcon } from "lucide-react";
import { useState } from "react";

interface EditPostModalProps {
  initialContent: string;
  initialImage?: string | null;
  onSave: (content: string, image?: File | null) => void;
  onClose: () => void;
  loading?: boolean;
}

export default function EditPostModal({ initialContent, initialImage, onSave, onClose, loading }: EditPostModalProps) {
  const [content, setContent] = useState(initialContent);
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-[#111111] rounded-2xl w-[550px] p-5 text-white relative shadow-xl">
        {/* Close button */}
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white">
          <X size={20} />
        </button>

        {/* Riwayat thread lama */}
        <div className="mb-4 border-b border-gray-700 pb-3">
          <p className="text-sm text-gray-400">Previous Thread</p>
          <p className="text-gray-300 mt-1 whitespace-pre-wrap">{initialContent}</p>
          {initialImage && <img src={initialImage} alt="old" className="mt-2 rounded-lg max-h-48 object-contain border border-gray-800" />}
        </div>

        {/* Edit area */}
        <textarea className="w-full bg-transparent resize-none outline-none text-white placeholder-gray-500 text-lg pr-4" rows={4} value={content} onChange={(e) => setContent(e.target.value)} />

        {/* Preview gambar baru */}
        {image && (
          <div className="mt-3">
            <div className="relative inline-block">
              <img src={URL.createObjectURL(image)} alt="preview" className="rounded-lg max-h-30 object-contain" />
              <button onClick={() => setImage(null)} className="absolute top-1 right-1 bg-black/70 rounded-full p-1 hover:bg-black">
                <X size={16} className="text-white" />
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center border-t border-gray-800 justify-between pt-3 px-1">
          {/* tombol upload gambar */}
          <label className="cursor-pointer text-green-500 hover:text-green-400 flex items-center gap-2">
            <ImageIcon size={25} />
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>

          <div className="flex gap-2">
            <button
              onClick={() => onSave(content, image)}
              disabled={loading || !content.trim()}
              className="bg-green-600 text-white px-5 py-1.5 rounded-full font-medium hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button onClick={onClose} className="bg-gray-700 text-white px-5 py-1.5 rounded-full font-medium hover:bg-gray-600">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
