// src/Layout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { ModeToggle } from "./components/mode-toggle";

function Layout() {
  return (
    <div className="flex min-h-screen bg-background text-foreground relative">
      {/* Sidebar */}
      <Sidebar />

      {/* ModeToggle Button - Fixed to screen */}
      <div className="fixed sm:top-2 top-22 right-2  z-500">
        <ModeToggle />
      </div>

      {/* Main Content */}
      <div className="flex-1 sm:ml-25 mt-20 sm:mt-0 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
