import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchUsers, followUser, unfollowUser } from "../services/followService";
import { useAppSelector } from "../store/hooks";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useProfileCounts } from "../hooks/useProfileCounts";

interface SearchUser {
  id: string;
  full_name: string;
  username: string;
  photo_profile?: string | null;
  isFollowing?: boolean;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);

  const me = useAppSelector((state) => state.auth.user);
  const { refreshCounts } = useProfileCounts();
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const users = await searchUsers(query);
      setResults(users);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query.length > 0) {
      handleSearch();
    } else {
      setResults([]);
    }
  }, [query]);

  const toggleFollow = async (user: SearchUser) => {
    console.log("Toggle follow clicked:", user);
    try {
      if (user.isFollowing) {
        await unfollowUser(user.id);
      } else {
        await followUser(user.id);
      }
      setResults((prev) => prev.map((userItem) => (userItem.id === user.id ? { ...userItem, isFollowing: !userItem.isFollowing } : userItem)));
      refreshCounts();
    } catch (err) {
      console.error("Follow/unfollow error:", err);
    }
  };

  const goToProfile = (user: SearchUser) => {
    if (user.id === me?.id) {
      navigate("/profile");
    } else {
      navigate(`/profile/${user.username}`);
    }
  };

  return (
    <div className="p-3 flex flex-col">
      <h2 className="text-2xl font-bold mb-3">Search Users</h2>

      {/* Input dengan icon */}
      <div className="relative w-full">
        <span className="absolute inset-y-0 left-[7px] flex items-center text-gray-400">
          <UserCircleIcon className="w-7 h-7" />
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or username..."
          className="w-full p-2 pl-10 rounded-full bg-[#181818] text-white focus:outline-none focus:ring-2 focus:ring-white"
        />
      </div>

      {/* Loading */}
      {loading && <p className="text-gray-400 mt-4">Loading...</p>}

      {!loading && results.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-36 text-center text-gray-400">
          <UserCircleIcon className="w-24 h-24 mb-4 text-gray-600" />
          <p className="text-lg">Search by name or username.</p>
        </div>
      )}

      {/* List results */}
      <div className="mt-4 flex flex-col gap-3 w-full">
        {results.map((u) => (
          <div key={u.id} className="flex justify-between items-center p-3 rounded-lg">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => goToProfile(u)}>
              <img src={u.photo_profile || "/default-avatar.png"} alt={u.full_name} className="w-10 h-10 rounded-full" />
              <div>
                <div className="font-semibold">{u.full_name}</div>
                <div className="text-gray-400">@{u.username}</div>
              </div>
            </div>

            {me?.id !== u.id && (
              <button
                onClick={() => toggleFollow(u)}
                className={`px-4 py-1 rounded-full text-sm font-medium ${u.isFollowing ? "border border-white text-white hover:bg-gray-900" : "border border-white text-white hover:bg-gray-900"}`}
              >
                {u.isFollowing ? "Following" : "Follow"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
