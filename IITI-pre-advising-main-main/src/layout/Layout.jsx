import React from "react";
import { Outlet } from "react-router-dom";

import Nav, { useSidebar } from "../navbar/nav.jsx";

export default function Layout() {
  const { collapsed } = useSidebar();
  const sidebarWidth = collapsed ? "5rem" : "18rem";

  return (
    <div className="h-screen overflow-hidden bg-[#f6fff2] box-border">
      <Nav />
      <main
        className="h-screen overflow-y-auto overflow-x-hidden transition-[margin-left,width] duration-300 ease-out"
        style={{
          marginLeft: sidebarWidth,
          width: `calc(100% - ${sidebarWidth})`,
          transition: "margin-left 0.2s ease, width 0.2s ease",
          boxSizing: "border-box"
        }}
      >
        <div className="min-h-full w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
