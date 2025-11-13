import { useEffect, useState } from "react";
import { useAppSelector } from "../store/hooks";
import EditProfileModal from "./EditProfileModal";
import { useNavigate } from "react-router-dom";
import { useProfileCounts } from "../hooks/useProfileCounts";
import { useSuggestedStore } from "../hooks/useSuggestedStore";

interface SuggestedUser {
  id: string;
  full_name: string;
  photo_profile?: string | null;
  username?: string;
}

const SidebarRight = () => {
  const user = useAppSelector((state) => state.auth.user);
  const [open, setOpen] = useState(false);
  const { followerCount, followingCount, refreshCounts } = useProfileCounts();
  const { suggested, fetchSuggested, removeSuggested } = useSuggestedStore();

  const navigate = useNavigate();

  useEffect(() => {
    fetchSuggested();
    refreshCounts();
  }, [fetchSuggested, refreshCounts]);

  const goToProfile = (u: SuggestedUser) => {
    if (u.id === user?.id) {
      navigate("/profile");
    } else {
      navigate(`/profile/${u.username || u.id}`);
    }
  };

  const handleFollow = async (u: SuggestedUser) => {
    const token = localStorage.getItem("token") || "";
    await fetch("http://localhost:5000/api/v1/follows", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ target_user_id: u.id }),
    });
    removeSuggested(u.id);
    refreshCounts();
  };

  return (
    <div className="w-full h-screen p-4 flex flex-col gap-6">
      {/* Profil user tetap */}
      {user && (
        <div className="bg-[#111111f3] p-3 rounded-xl">
          <h2 className="mb-2 text-xl font-semibold">My Profile</h2>

          {/* Cover + avatar + edit */}
          <div className="relative">
            <div className="h-22 w-full rounded-xl overflow-hidden">
              <img src={user.photo_sampul || "/default-cover.jpg"} alt="cover" className="w-full h-full object-cover" />
            </div>

            <div className="absolute -bottom-10 left-5">
              <img src={user.photo_profile || "/default-avatar.png"} alt={user.full_name} className="w-20 h-20 rounded-full border-4 border-[#111111f3] object-cover" />
            </div>

            <button onClick={() => setOpen(true)} className="absolute top-25 right-2 bg-transparent border border-white text-white px-4 py-[2px] rounded-full text-sm hover:bg-white/10">
              Edit Profile
            </button>
          </div>

          <div className="mt-12 flex flex-col gap-0">
            <div className="font-bold text-xl text-white">{user.full_name}</div>
            <div className="text-gray-400 text-sm">@{user.username}</div>
            {user.bio && <div className="text-gray-300 text-md mt-3">{user.bio}</div>}
          </div>

          <div className="flex gap-5 mt-5">
            <span onClick={() => navigate("/follows?tab=following")} className="cursor-pointer hover:underline">
              <span className="text-white text-[18px] font-semibold">{followingCount}</span>
              <span className="text-[16px] text-gray-400"> Following</span>
            </span>
            <span onClick={() => navigate("/follows?tab=followers")} className="cursor-pointer hover:underline">
              <span className="text-white text-[18px] font-semibold">{followerCount}</span>
              <span className="text-[16px] text-gray-400"> Followers</span>
            </span>
          </div>
        </div>
      )}

      <EditProfileModal open={open} onClose={() => setOpen(false)} />

      {/* Suggested users */}
      <div className="bg-[#111111f3] p-3 rounded-xl">
        <h3 className="rounded-xl text-xl font-semibold mb-5">Suggested for you</h3>
        <div className="flex flex-col gap-3">
          {suggested.map((u) => (
            <div key={u.id} className="flex justify-between items-center">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => goToProfile(u)}>
                <img src={u.photo_profile || "/default-avatar.png"} alt={u.full_name} className="w-8 h-8 rounded-full" />
                <div>
                  <div className="font-medium">{u.full_name}</div>
                  <div className="text-gray-500 text-sm">@{u.username}</div>
                </div>
              </div>
              <button onClick={() => handleFollow(u)} className="border px-3 py-1 rounded-full text-sm hover:bg-gray-900">
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarRight;
