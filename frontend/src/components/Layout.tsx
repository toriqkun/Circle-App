import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import SidebarLeft from "./SidebarLeft";
import SidebarRight from "./SidebarRight";

interface LayoutProps {
  children?: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex bg-black text-white h-screen justify-center overflow-y-auto scrollbar-thin"
      style={{
        scrollbarColor: "rgba(255, 255, 255, 0.37) rgba(0, 0, 0, 1)",
      }}
    >
      {/* Sidebar kiri */}
      <div className="hidden md:block w-[250px] lg:w-[300px] flex-shrink-0 sticky top-0 h-screen">
        <SidebarLeft />
      </div>

      {/* Konten utama (ikut scroll) */}
      <main className="flex-1 max-w-[900px] flex-shrink-0 min-h-screen">
        {children || <Outlet />}
      </main>

      {/* Sidebar kanan */}
      <div className="hidden lg:block w-[320px] flex-shrink-0 sticky top-0 h-screen">
        <SidebarRight />
      </div>
    </div>
  );
}



