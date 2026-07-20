import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import iitiLOGO from "./navbarLOGO/iitiLogo.png";
import dashboardLogo from "./navbarLOGO/dashboardLogo.png";
import yearLevelLogo from "./navbarLOGO/yearLevelLogo.png";
import preAdvisingLogo from "../assets/photo/preAdvisingLogo.png";
import scheduleLogo from "./navbarLOGO/scheduleLogo.png";
import settingLogo from "./navbarLOGO/settingLogo.png";

const SidebarContext = createContext(null);

export function SidebarProvider({ children }) {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("sidebar-collapsed");
      return saved === "true";
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("sidebar-collapsed", String(collapsed));
    }
  }, [collapsed]);

  const value = useMemo(
    () => ({ collapsed, toggleCollapsed: () => setCollapsed((prev) => !prev) }),
    [collapsed]
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar() {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error("useSidebar must be used inside a SidebarProvider");
  }

  return context;
}

const ReportIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 3.75h4.19a1.5 1.5 0 011.06.44l3.56 3.56a1.5 1.5 0 01.44 1.06V19.5A1.5 1.5 0 0116.75 21H9A1.5 1.5 0 017.5 19.5v-15A1.5 1.5 0 019 3.75z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 12h6M10 15.5h6M10 8.5h2.5" />
  </svg>
);

const SubjectListingIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 6.5A2.5 2.5 0 016.5 4H20v14.5a1.5 1.5 0 01-1.5 1.5H6.5A2.5 2.5 0 014 17.5v-11z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 17.5A2.5 2.5 0 016.5 15H20" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 8h8M8 11h8" />
  </svg>
);

export function PageShell({ children }) {
  const { collapsed } = useSidebar();
  const sidebarWidth = collapsed ? "5rem" : "18rem";

  return (
    <div className="min-h-screen bg-[#f6fff2]">
      <Nav />
      <div
        className="min-h-screen transition-[margin-left] duration-300 ease-out md:ml-[var(--sidebar-width)]"
        style={{ marginLeft: sidebarWidth, transition: "margin-left 0.2s ease" }}
      >
        {children}
      </div>
    </div>
  );
}

function Nav() {
  const location = useLocation();
  const { collapsed, toggleCollapsed } = useSidebar();

  const pathToKey = {
    "/dashboard": "dashboard",
    "/year-level": "yearlevel",
    "/pre-advising": "pre-advising",
    "/pre-advising-list": "pre-advising",
    "/pre-advising-sections": "pre-advising",
    "/pre-advising-student": "pre-advising",
    "/pre-advising-1st-sem": "pre-advising",
    "/pre-advising-2nd-sem": "pre-advising",
    "/pre-advising-subjects": "pre-advising",
    "/schedule": "schedule",
    "/viewSchedule": "schedule",
    "/viewSection": "schedule",
    "/subject-listing": "subjectlisting",
    "/subject-listing-students": "subjectlisting",
    "/report": "report",
    "/report/year": "report",
    "/report/subject": "report",
    "/settings": "setting",
    "/profile": "setting",
    "/section": "yearlevel",
    "/list": "yearlevel",
    "/viewGrade": "yearlevel"
  };

  const active = pathToKey[location.pathname] || "dashboard";

  const navItems = [
    { key: "dashboard", path: "/dashboard", label: "Dashboard", icon: dashboardLogo, alt: "Dashboard" },
    { key: "yearlevel", path: "/year-level", label: "Year Level", icon: yearLevelLogo, alt: "Year Level" },
    { key: "pre-advising", path: "/pre-advising", label: "Pre-Advising", icon: preAdvisingLogo, alt: "Pre Advising" },
    { key: "schedule", path: "/schedule", label: "Schedule", icon: scheduleLogo, alt: "Schedule" },
    { key: "report", path: "/report", label: "Report", alt: "Report" },
    { key: "setting", path: "/settings", label: "Settings", icon: settingLogo, alt: "Settings" }
  ];

  return (
    <aside className="font-RB tracking-wide">
      <div
        className={`fixed left-0 top-0 z-50 flex h-full flex-col overflow-x-hidden border-r border-white/10 bg-[#1C6100] shadow-2xl transition-all duration-300 ease-out ${
          collapsed ? "w-20" : "w-72"
        }`}
        style={{ boxSizing: "border-box" }}
      >
        <button
          type="button"
          onClick={toggleCollapsed}
          className="absolute right-[-0.75rem] top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#0E5A12] text-lg text-white shadow-lg transition hover:bg-[#145b16]"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? "›" : "‹"}
        </button>

        <div className={`flex items-center justify-center transition-all duration-300 ${collapsed ? "px-3 py-4" : "px-5 py-5"}`}>
          <img
            src={iitiLOGO}
            alt="IITI Logo"
            className={`rounded-full bg-white object-cover shadow-md transition-all duration-300 ${collapsed ? "h-10 w-10" : "h-16 w-16"}`}
          />
        </div>

        <div className={`overflow-hidden bg-[#0E5A12] px-4 py-4 shadow-xl transition-all duration-300 ${collapsed ? "h-0 opacity-0" : "h-auto opacity-100"}`}>
          <h1 className="text-center text-sm font-semibold leading-5 tracking-wide text-white">
            Instituto ng Teknolohiya ng
            <br />
            Impormasyon at Pagbabago
          </h1>
        </div>

        <div className="flex flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden px-2 py-4">
          {navItems.map((item) => {
            const isActive = active === item.key;
            const content = (
              <div
                className={`group flex items-center rounded-lg px-3 py-2.5 transition-all duration-200 active:scale-95 ${
                  isActive
                    ? "border border-white/30 bg-[#A0FBA333] text-white"
                    : "text-white hover:bg-green-800"
                } ${collapsed ? "justify-center" : "justify-start"}`}
              >
                {item.key === "subjectlisting" ? (
                  <SubjectListingIcon className={`h-5 w-5 shrink-0 ${collapsed ? "" : "mr-3"}`} />
                ) : item.key === "report" ? (
                  <ReportIcon className={`h-5 w-5 shrink-0 ${collapsed ? "" : "mr-3"}`} />
                ) : (
                  <img
                    src={item.icon}
                    alt={item.alt}
                    className={`shrink-0 ${collapsed ? "h-5 w-5" : "mr-3 h-5 w-5"}`}
                  />
                )}

                {!collapsed && <h1 className="text-sm font-medium">{item.label}</h1>}
              </div>
            );

            return (
              <Link
                key={item.key}
                to={item.path}
                className={`relative block ${collapsed ? "px-1" : "px-1"}`}
                title={collapsed ? item.label : undefined}
              >
                {content}
                {collapsed && (
                  <span className="pointer-events-none absolute left-full top-1/2 ml-2 -translate-y-1/2 rounded bg-[#0E5A12] px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

export default Nav;
