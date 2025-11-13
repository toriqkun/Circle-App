import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { updateUser } from "../store/authSlice";
import { Camera, XCircle } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function EditProfileModal({ open, onClose }: Props) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [cover, setCover] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [loading, setLoading] = useState(false);

  // isi form dengan data redux saat modal kebuka
  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
      setUsername(user.username || "");
      setBio(user.bio || "");
      setPhotoPreview(user.photo_profile || "");
      setCoverPreview(user.photo_sampul || "");
    }
  }, [user, open]);

  if (!open) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCover(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (loading) return;
    setLoading(true);

    try {
      await dispatch(
        updateUser({
          full_name: fullName,
          username,
          bio,
          photo: photo || undefined,
          cover: cover || undefined,
        })
      ).unwrap();
      onClose();
    } catch (err) {
      console.error("Update gagal:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="bg-[#111] rounded-xl w-[500px] p-4 relative text-white">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-semibold">Edit Profile</h2>
          {/* Close button */}
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Cover gradient */}
        <div className="h-33 bg-gray-800 rounded-xl relative mb-12">
          <img src={coverPreview || "/default-cover.jpg"} alt="cover" className="w-full h-full object-cover rounded-xl" />
          <label htmlFor="coverInput" className="absolute top-25 right-2 bg-black/50 px-2 py-1 rounded-full text-sm cursor-pointer hover:bg-black/70">
            ˙✧˖
          </label>
          <input id="coverInput" type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
          <div className="absolute -bottom-10 left-5">
            <div className="relative group">
              <img src={photoPreview || "/default-avatar.png"} alt="profile" className="w-20 h-20 rounded-full border-4 border-[#111] object-cover" />
              {/* camera overlay */}
              <label htmlFor="photoInput" className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition">
                <Camera className="w-6 h-6 text-white" />
              </label>
              <input id="photoInput" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </div>
          </div>
        </div>

        {/* Form fields */}
        <div className="mt-14 flex flex-col gap-1">
          <div>
            <label className="text-xs text-gray-400">Name</label>
            <input className="w-full bg-transparent border border-gray-700 rounded-md px-3 py-2 mt-1" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-gray-400">Username</label>
            <input className="w-full bg-transparent border border-gray-700 rounded-md px-3 py-2 mt-1" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-gray-400">Bio</label>
            <textarea className="w-full bg-transparent border border-gray-700 rounded-md px-3 py-2 mt-1 resize-none" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end mt-6 border-t border-gray-700 pt-3">
          <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-full px-6 py-2 disabled:opacity-50" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
