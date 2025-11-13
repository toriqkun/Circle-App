// import { useState } from "react";
// import { Home, Search, User, Heart } from "lucide-react";
// import { NavLink, useNavigate } from "react-router-dom";
// import CreatePostModal from "../components/CreatePostModal";

// export default function SidebarLeft() {
//   const navigate = useNavigate();
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const logout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   return (
//     <div className="w-[300px] h-screen p-6 flex flex-col">
//       <h1 className="text-green-600 text-3xl font-bold mb-10">circle</h1>
//       <nav className="flex flex-col gap-6">
//         <NavLink
//           to="/"
//           className={({ isActive }) => `flex items-center gap-3 text-lg px-2 py-1 rounded-md transition-colors ${isActive ? "text-green-600 font-semibold" : "text-gray-300 hover:text-white"}`}
//         >
//           <Home /> Home
//         </NavLink>

//         <NavLink
//           to="/search"
//           className={({ isActive }) => `flex items-center gap-3 text-lg px-2 py-1 rounded-md transition-colors ${isActive ? "text-green-600 font-semibold" : "text-gray-300 hover:text-white"}`}
//         >
//           <Search /> Search
//         </NavLink>

//         <NavLink
//           to="/follows"
//           className={({ isActive }) => `flex items-center gap-3 text-lg px-2 py-1 rounded-md transition-colors ${isActive ? "text-green-600 font-semibold" : "text-gray-300 hover:text-white"}`}
//         >
//           <Heart /> Follows
//         </NavLink>

//         <NavLink
//           to="/profile"
//           className={({ isActive }) => `flex items-center gap-3 text-lg px-2 py-1 rounded-md transition-colors ${isActive ? "text-green-600 font-semibold" : "text-gray-300 hover:text-white"}`}
//         >
//           <User /> Profile
//         </NavLink>
//       </nav>

//       <button onClick={() => setIsModalOpen(true)} className="mt-10 bg-green-600 text-white p-2 rounded-lg hover:bg-green-700">
//         Create Post
//       </button>

//       <CreatePostModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />

//       <button onClick={logout} className="w-21 mt-auto text-start text-lg ms-5 text-white hover:text-red-500 font-semibold">
//         ⏻ Logout
//       </button>
//     </div>
//   );
// }

import { useState, useRef, useEffect } from "react";
import { Home, Search, User, Heart, MoreHorizontal } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import CreatePostModal from "../components/CreatePostModal";
import { useAppSelector } from "../store/hooks";

export default function SidebarLeft() {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-[300px] h-screen p-6 flex flex-col justify-between relative">
      {/* Logo & Nav */}
      <div>
        <h1 className="text-green-600 text-3xl font-bold mb-10">circle</h1>
        <nav className="flex flex-col gap-6">
          <NavLink
            to="/"
            className={({ isActive }) => `flex items-center gap-3 text-lg px-2 py-1 rounded-md transition-colors ${isActive ? "text-green-600 font-semibold" : "text-gray-300 hover:text-white"}`}
          >
            <Home /> Home
          </NavLink>

          <NavLink
            to="/search"
            className={({ isActive }) => `flex items-center gap-3 text-lg px-2 py-1 rounded-md transition-colors ${isActive ? "text-green-600 font-semibold" : "text-gray-300 hover:text-white"}`}
          >
            <Search /> Search
          </NavLink>

          <NavLink
            to="/follows"
            className={({ isActive }) => `flex items-center gap-3 text-lg px-2 py-1 rounded-md transition-colors ${isActive ? "text-green-600 font-semibold" : "text-gray-300 hover:text-white"}`}
          >
            <Heart /> Follows
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) => `flex items-center gap-3 text-lg px-2 py-1 rounded-md transition-colors ${isActive ? "text-green-600 font-semibold" : "text-gray-300 hover:text-white"}`}
          >
            <User /> Profile
          </NavLink>
        </nav>

        <button onClick={() => setIsModalOpen(true)} className="mt-10 bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 w-full">
          Create Post
        </button>

        <CreatePostModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>

      {/* User info + menu */}
      {user && (
        <div className="relative mt-10" ref={menuRef}>
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-[#1a1a1a] transition cursor-pointer" onClick={() => setMenuOpen((prev) => !prev)}>
            <div className="flex items-center gap-3">
              <img src={user.photo_profile || "/default-avatar.png"} alt={user.full_name} className="w-10 h-10 rounded-full object-cover" />
              <div className="flex flex-col leading-tight">
                <span className="text-white font-semibold">{user.full_name}</span>
                <span className="text-gray-400 text-sm">@{user.username}</span>
              </div>
            </div>
            <MoreHorizontal className="text-white" />
          </div>

          {/* Popup Menu */}
          {menuOpen && (
            <div className="absolute bottom-16 left-0 bg-[#1d1d1d] border border-gray-800 rounded-lg shadow-lg w-[250px] py-2 overflow-hidden z-50">
              <button
                onClick={() => {
                  navigate("/profile");
                  setMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-white hover:bg-[#2e2e2e]"
              >
                Profile
              </button>
              <button onClick={logout} className="w-full text-left px-4 py-2 text-red-500 hover:bg-[#2e2e2e]">
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
