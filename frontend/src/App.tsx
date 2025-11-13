import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./routes/ProtectedRoute";
import ThreadDetail from "./pages/ThreadDetail";
import { useAppDispatch } from "./store/hooks";
import { loadUser } from "./store/authSlice";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import api from "./utils/axios";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import FollowsPage from "./pages/FollowsPage";
import SearchPage from "./pages/SearchPage";
import ImageDetail from "./pages/ImageDetail";

export default function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      dispatch(loadUser());
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Protected routes with layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="thread/:id" element={<ThreadDetail />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:username" element={<UserProfile />} />
          <Route path="follows" element={<FollowsPage />} />
          <Route path="search" element={<SearchPage />} />
        </Route>
        <Route
          path="/media/:threadId"
          element={
            <ProtectedRoute>
              <ImageDetail />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
