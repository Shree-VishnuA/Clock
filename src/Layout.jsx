// src/Layout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { ModeToggle } from "./components/mode-toggle";

function Layout() {
  return (
    <div className="flex overflow-y-hidden min-h-screen bg-background text-foreground">
      <div>
        <Sidebar />
      </div>
      <div className="sm:w-[calc(100vw-100px)] sm:ml-25 sm:mt-0 w-screen mt-20">
        <div className="fixed top-2 right-2 z-50">
          <ModeToggle></ModeToggle>
        </div>
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
