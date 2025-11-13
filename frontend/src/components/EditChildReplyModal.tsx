import { Button } from "@/components/ui/button";
import { useState } from "react";
import { X } from "lucide-react";

type Props = {
  initialContent: string;
  loading?: boolean;
  onSave: (newContent: string) => Promise<void> | void;
  onClose: () => void;
};

export default function EditChildReplyModal({ initialContent, onSave, onClose, loading }: Props) {
  const [content, setContent] = useState(initialContent);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    await onSave(content.trim());
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#111111] relative rounded-xl p-4 w-full max-w-lg">
        {/* Close button */}
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-white">
          <X size={20} />
        </button>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} className="w-full p-2 rounded-md text-white bg-transparent resize-none outline-none " />

          <div className="flex justify-end gap-2 border-t border-gray-600 pt-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
