import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { store } from "../store";
import { setFollowerCount, setFollowingCount } from "../store/authSlice";
import EditProfileModal from "../components/EditProfileModal";
import { getThreadsByUser } from "../services/threadService";
import ThreadCard from "../components/ThreadCard";
import { ArrowLeft } from "lucide-react";

export default function Profile() {
  const user = useAppSelector((s) => s.auth.user);
  const [threads, setThreads] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"all" | "media">("all");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) getThreadsByUser(user.username).then(setThreads).catch(console.error);
  }, [user]);

  useEffect(() => {
    if (user) {
      fetch("http://localhost:5000/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => res.json())
        .then((res) => {
          store.dispatch(setFollowerCount(res.data.followerCount));
          store.dispatch(setFollowingCount(res.data.followingCount));
        })
        .catch(console.error);
    }
  }, [user]);

  if (!user) return null;
  const displayedThreads = tab === "all" ? threads : threads.filter((t) => t.image);

  return (
    <div className="flex flex-col text-white min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 p-3">
        <button onClick={() => navigate(-1)} className="p-0 rounded-full hover:bg-gray-800">
          <ArrowLeft size={25} />
        </button>
        <h1 className="text-2xl font-bold">{user.full_name}</h1>
      </div>

      {/* Banner */}
      <div className="relative px-3">
        <img src={user.photo_sampul || "/default-cover.jpg"} alt="cover" className="h-40 w-full object-cover rounded-[10px]" />
        <img src={user.photo_profile || "/default-avatar.png"} alt={user.full_name} className="w-28 h-28 rounded-full border-4 border-black absolute bottom-[-50px] left-10 object-cover" />
        <button onClick={() => setOpen(true)} className="absolute right-4 bottom-[-40px] border px-5 py-[4.5px] rounded-full text-sm hover:bg-gray-900">
          Edit Profile
        </button>
      </div>

      {/* Info */}
      <div className="mt-16 px-6">
        <h2 className="text-xl font-bold">{user.full_name}</h2>
        <p className="text-gray-400">@{user.username}</p>
        <p className="mt-2">{user.bio}</p>

        <div className="mt-4 flex gap-4">
          <span>
            <span className="text-white text-lg font-semibold">{user.followingCount}</span> <span className="text-md text-gray-400">Following</span>
          </span>
          <span>
            <span className="text-white text-lg font-semibold">{user.followerCount}</span> <span className="text-md text-gray-400">Followers</span>
          </span>
        </div>
      </div>

      {/* Tab */}
      <div className="flex mt-6 border-b border-gray-800">
        <button className={`flex-1 py-2 ${tab === "all" ? "text-green-500 border-b-2 border-green-500" : "text-gray-400"}`} onClick={() => setTab("all")}>
          All Post
        </button>
        <button className={`flex-1 py-2 ${tab === "media" ? "text-green-500 border-b-2 border-green-500" : "text-gray-400"}`} onClick={() => setTab("media")}>
          Media
        </button>
      </div>

      {/* Threads */}
      <div className="grid">
        {tab === "media" ? (
          // Media grid
          <div className="mt-4 px-4 grid grid-cols-3 gap-2">
            {displayedThreads.map((t) => (
              <Link key={t.id} to={`/media/${t.id}`}>
                <img src={t.image ?? "/default-image.png"} alt="media" className="rounded-lg object-cover w-full cursor-pointer hover:opacity-90" />
              </Link>
            ))}
          </div>
        ) : (
          displayedThreads.map((t) => <ThreadCard key={t.id} thread={t} />)
        )}
      </div>

      <EditProfileModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
