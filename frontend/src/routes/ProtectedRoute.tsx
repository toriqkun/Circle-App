import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import type { ReactNode } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, initialized } = useAppSelector((state) => state.auth);
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          message: "Harus login terlebih dahulu.",
          from: location.pathname, // ← tambahkan info asal
        }}
      />
    );
  }

  if (!initialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          message: "Harus login terlebih dahulu.",
          from: location.pathname, // ← tambahkan juga di sini
        }}
      />
    );
  }

  return <>{children}</>;
}
