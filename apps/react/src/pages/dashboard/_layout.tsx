import { cn } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { useDeviceType } from "@/hooks";

import { Footer, Navbar, Sidebar } from "./_components";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const path = useLocation();
  const { isMobile } = useDeviceType();

  useEffect(() => {
    const className = ["overflow-x-hidden"];
    document.body.classList.add(...className);

    return () => {
      document.body.classList.remove(...className);
    };
  }, []);

  useEffect(() => {
    const isSidebarOpen = JSON.parse(
      localStorage.getItem("isSidebarOpen") || "false",
    );

    if (isMobile) return setIsSidebarOpen(false);
    setIsSidebarOpen(isSidebarOpen);
  }, [isMobile, path]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    localStorage.setItem("isSidebarOpen", JSON.stringify(!isSidebarOpen));
  };

  const sidebarClassName = isSidebarOpen
    ? "col-span-12 md:col-span-3"
    : "hidden";

  const mainClassName = isSidebarOpen
    ? "col-span-12 md:col-span-9"
    : "col-span-12 md:col-span-12";

  return (
    <div className="grid grid-cols-12">
      {/* Sidebar */}
      <div className={sidebarClassName}>
        <Sidebar toggleSidebar={toggleSidebar} />
      </div>

      <div className={cn(mainClassName, "flex h-screen flex-col")}>
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Main Content */}
        <main className="container my-5 flex-1 overflow-auto p-3">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
