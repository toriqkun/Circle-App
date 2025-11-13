import { createSlice, type PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/axios";
import type { User } from "../models/User";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  initialized: false,
};

export const loadUser = createAsyncThunk("auth/loadUser", async (_, thunkAPI) => {
  try {
    const res = await api.get("/profile");
    console.log("Profile API Response:", res.data);
    return res.data.data as User;
  } catch (err) {
    return thunkAPI.rejectWithValue("Failed to load user");
  }
});

export const updateUser = createAsyncThunk("auth/updateUser", async (updatedData: { full_name?: string; username?: string; bio?: string; photo?: File; cover?: File | null }, thunkAPI) => {
  try {
    const formData = new FormData();
    if (updatedData.full_name) formData.append("full_name", updatedData.full_name);
    if (updatedData.username) formData.append("username", updatedData.username);
    if (updatedData.bio) formData.append("bio", updatedData.bio);
    // photo_profile
    if (updatedData.photo === null) {
      formData.append("photo_profile", "");
    } else if (updatedData.photo) {
      formData.append("photo_profile", updatedData.photo);
    }
    // photo_sampul
    if (updatedData.cover === null) {
      formData.append("photo_sampul", "");
    } else if (updatedData.cover) {
      formData.append("photo_sampul", updatedData.cover);
    }

    const res = await api.put("/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data as User;
  } catch (err) {
    return thunkAPI.rejectWithValue("Failed to update user");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      if (!action.payload) {
        localStorage.removeItem("token");
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("token");
    },
    setFollowerCount: (state, action: PayloadAction<number>) => {
      if (state.user) state.user.followerCount = action.payload;
    },
    setFollowingCount: (state, action: PayloadAction<number>) => {
      if (state.user) state.user.followingCount = action.payload;
    },
    updateCounts: (state, action: PayloadAction<{ followerCount?: number; followingCount?: number }>) => {
      if (state.user) {
        if (action.payload.followerCount !== undefined) {
          state.user.followerCount = action.payload.followerCount;
        }
        if (action.payload.followingCount !== undefined) {
          state.user.followingCount = action.payload.followingCount;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          ...action.payload,
          followingCount: action.payload.followingCount ?? state.user?.followingCount ?? 0,
          followerCount: action.payload.followerCount ?? state.user?.followerCount ?? 0,
        };
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(loadUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          ...action.payload,
          followingCount: action.payload.followingCount ?? 0,
          followerCount: action.payload.followerCount ?? 0,
        };
        state.error = null;
        state.initialized = true;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload as string;
        state.initialized = true;
        localStorage.removeItem("token");
      });
  },
});

export const { setUser, setLoading, logout, setFollowerCount, setFollowingCount, updateCounts } = authSlice.actions;
export default authSlice.reducer;
