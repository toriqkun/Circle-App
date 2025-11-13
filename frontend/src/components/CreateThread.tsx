import { useState } from "react";

export default function CreateThread({ onThreadCreated }: { onThreadCreated: () => void }) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return alert("Content tidak boleh kosong");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("content", content);
      if (image) formData.append("image", image);

      const res = await fetch("http://localhost:5000/api/v1/auth/thread", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert("Thread berhasil dibuat!");
        setContent("");
        setImage(null);
        onThreadCreated();
      } else {
        alert(data.message || "Gagal membuat thread");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-background rounded-2xl shadow-md">
      <textarea className="w-full p-2 border rounded-md" placeholder="What is happening?!" value={content} onChange={(e) => setContent(e.target.value)} />

      <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="my-2" />

      <button onClick={handleSubmit} disabled={loading} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">
        {loading ? "Posting..." : "Reply"}
      </button>
    </div>
  );
}
