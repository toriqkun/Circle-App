import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchFollows } from "../services/followService";
import { useAppSelector } from "../store/hooks";
import { useProfileCounts } from "../hooks/useProfileCounts";

interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  is_following?: boolean;
}

export default function FollowsPage() {
  const [tab, setTab] = useState<"followers" | "following">("followers");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const authUser = useAppSelector((state) => state.auth.user);
  const { refreshCounts } = useProfileCounts();

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token") || "";
        const data = await fetchFollows(token, tab);

        if (isMounted) {
          setUsers(data);
        }
      } catch (err) {
        console.error("❌ Network error:", err);
        if (isMounted) setUsers([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [tab]);

  const goToProfile = (user: User) => {
    if (user.id === authUser?.id) {
      navigate("/profile");
    } else {
      navigate(`/profile/${user.username}`);
    }
  };

  const toggleFollow = async (user: User) => {
    try {
      const token = localStorage.getItem("token") || "";

      if (tab === "followers") {
        if (!user.is_following) {
          // FOLLOW
          const res = await fetch("http://localhost:5000/api/v1/follows", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ target_user_id: user.id }),
          });
          const json = await res.json();
          if (json.status === "success") {
            setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, is_following: true } : u)));
            refreshCounts();
          }
        } else {
          // UNFOLLOW
          const res = await fetch(`http://localhost:5000/api/v1/follows/${user.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
          const json = await res.json();
          if (json.status === "success") {
            setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, is_following: false } : u)));
            refreshCounts();
          }
        }
      } else {
        // FOLLOWING → UNFOLLOW
        const res = await fetch(`http://localhost:5000/api/v1/follows/${user.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json.status === "success") {
          setUsers((prev) => prev.filter((u) => u.id !== user.id));
          refreshCounts();
        }
      }
    } catch (err) {
      console.error("❌ Toggle follow error:", err);
    }
  };

  return (
    <div className="flex flex-col text-white">
      {/* Header */}
      <div className="flex items-center gap-3 p-3">
        <h1 className="text-2xl font-bold">Follows</h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        <button className={`flex-1 py-3 text-center ${tab === "followers" ? "border-b-2 border-green-500 font-semibold" : "text-gray-400"}`} onClick={() => setTab("followers")}>
          Followers
        </button>
        <button className={`flex-1 py-3 text-center ${tab === "following" ? "border-b-2 border-green-500 font-semibold" : "text-gray-400"}`} onClick={() => setTab("following")}>
          Following
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : users.length === 0 ? (
          <p className="text-gray-400 text-center">No data</p>
        ) : (
          <div className="flex flex-col gap-4">
            {users.map((u) => (
              <div key={u.id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => goToProfile(u)}>
                  <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold">{u.name}</p>
                    <p className="text-sm text-gray-400">@{u.username}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleFollow(u)}
                  className={`px-4 py-1 rounded-full border text-sm ${tab === "followers" ? (u.is_following ? "hover:bg-gray-900" : "hover:bg-gray-900") : "hover:bg-gray-900"}`}
                >
                  {tab === "followers" ? (u.is_following ? "Following" : "Follow") : "Following"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
