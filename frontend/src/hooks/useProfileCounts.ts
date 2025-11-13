import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { updateCounts } from "../store/authSlice";
import api from "../utils/axios";

export function useProfileCounts() {
  const dispatch = useAppDispatch();
  const counts = useAppSelector((s) => ({
    followerCount: s.auth.user?.followerCount || 0,
    followingCount: s.auth.user?.followingCount || 0,
  }));

  const refreshCounts = async () => {
    try {
      const res = await api.get("/profile");
      if (res.data.status === "success") {
        dispatch(
          updateCounts({
            followerCount: res.data.data.followerCount,
            followingCount: res.data.data.followingCount,
          })
        );
      }
    } catch (err) {
      console.error("refreshCounts error:", err);
    }
  };

  useEffect(() => {
    refreshCounts();
  }, []);

  return { ...counts, refreshCounts };
}
