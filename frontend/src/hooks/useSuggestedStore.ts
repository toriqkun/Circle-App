import { create } from "zustand";
import api from "../utils/axios";

export interface SuggestedUser {
  id: string;
  full_name: string;
  photo_profile?: string | null;
  username?: string;
}

interface SuggestedState {
  suggested: SuggestedUser[];
  fetchSuggested: () => Promise<void>;
  removeSuggested: (id: string) => void;
}

export const useSuggestedStore = create<SuggestedState>((set) => ({
  suggested: [],
  fetchSuggested: async () => {
    const token = localStorage.getItem("token") || "";
    const res = await api.get("/users/suggested", {
      headers: { Authorization: `Bearer ${token}` },
    });
    set({ suggested: res.data.data });
  },
  removeSuggested: (id: string) =>
    set((state: SuggestedState) => ({
      suggested: state.suggested.filter((u: SuggestedUser) => u.id !== id),
    })),
}));
