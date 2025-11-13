import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppSelector } from "../store/hooks";
import { getUserByUsername } from "../services/userService";
import { getThreadsByUser } from "../services/threadService";
import ThreadCard from "../components/ThreadCard";
import { ArrowLeft } from "lucide-react";
import { followUser, unfollowUser } from "../services/followService";
import { useProfileCounts } from "../hooks/useProfileCounts";

export default function UserProfile() {
  const { username } = useParams<{ username: string }>();
  const authUser = useAppSelector((s) => s.auth.user);
  const [user, setUser] = useState<any>(null);
  const [threads, setThreads] = useState<any[]>([]);
  const [tab, setTab] = useState<"all" | "media">("all");
  const navigate = useNavigate();
  const { refreshCounts } = useProfileCounts();

  useEffect(() => {
    if (username) {
      getUserByUsername(username)
        .then((data) => setUser(data))
        .catch(console.error);
      getThreadsByUser(username).then(setThreads).catch(console.error);
    }
  }, [username]);

  if (!user) return <div className="text-white p-6">Loading...</div>;

  const isSelf = authUser?.username === user.username;

  const handleFollow = async () => {
    if (!user.is_following) {
      await followUser(user.id);
      setUser({ ...user, is_following: true, followerCount: user.followerCount + 1 });
      refreshCounts();
    } else {
      await unfollowUser(user.id);
      setUser({ ...user, is_following: false, followerCount: user.followerCount - 1 });
      refreshCounts();
    }
  };

  const displayedThreads = tab === "all" ? threads : threads.filter((t) => t.image);

  return (
    <div className="flex flex-col text-white min-h-screen border-x border-gray-800">
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
        {!isSelf && (
          <button onClick={handleFollow} className="absolute right-4 bottom-[-40px] border px-5 py-[4.5px] rounded-full text-sm hover:bg-gray-900">
            {user.is_following ? "Following" : "Follow"}
          </button>
        )}
      </div>

      {/* Info */}
      <div className="mt-16 px-6">
        <h2 className="text-2xl font-bold">{user.full_name}</h2>
        <p className="text-gray-400">@{user.username}</p>
        <p className="mt-2">{user.bio}</p>

        {/* Followers / Following */}
        <div className="mt-2 flex gap-4 text-gray-400 text-sm">
          <span>{user.followingCount} Following</span>
          <span>{user.followerCount} Followers</span>
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
    </div>
  );
}
