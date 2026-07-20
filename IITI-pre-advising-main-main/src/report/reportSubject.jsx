import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import arrow from "../assets/photo/arrow.png";
import next from "../assets/photo/next.png";
import search from "../assets/photo/search.png";
import adminLogo from "../dashboard/dashboardLOGO/adminLogo.png";
import { getEntry } from "./reportData";

const ReportSubject = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const yearLevel = location.state?.yearLevel;
  const yearTitle = location.state?.yearTitle ?? "Year Level";
  const code = location.state?.code;
  const professor = location.state?.professor;

  const [query, setQuery] = useState("");

  const entry = getEntry(yearLevel, code, professor);

  const filteredStudents = useMemo(() => {
    if (!entry) return [];
    if (!query.trim()) return entry.students;
    const q = query.trim().toLowerCase();
    return entry.students.filter((s) => s.name.toLowerCase().includes(q));
  }, [entry, query]);

  if (!entry) {
    return (
      <div className="min-h-screen w-full bg-gray-100 font-RB p-10">
        <p className="text-gray-500">No data found for this subject.</p>
        <Link to="/report" className="text-[#1C6100] underline text-sm">
          Back to Report
        </Link>
      </div>
    );
  }

  return (
    <div className="h-screen w-full max-w-full overflow-hidden bg-gray-100 font-RB box-border flex flex-col">
      {/* Header */}
      <div className="p-5 pt-14 flex justify-between items-start border-b-5 border-[#D9D9D9] shrink-0">
        <div className="flex flex-col items-start gap-1 text-[1.5625rem]">
          <button onClick={() => navigate(-1)} className="cursor-pointer">
            <img src={arrow} alt="Back" className="w-4 h-4 active:scale-95" />
          </button>
          <div className="flex items-center gap-3 mt-1">
            <Link to="/report" className="font-bold text-black/50">
              Report
            </Link>
            <img src={next} className="w-3 h-3" alt="" />
            <span className="font-bold text-black">
              {yearTitle.replace("BSIT ", "")}
            </span>
          </div>
        </div>

        <Link to="/profile">
          <div className="flex flex-col items-center cursor-pointer active:scale-95">
            <img src={adminLogo} alt="admin" className="h-10.5 w-10.5" />
            <h1 className="text-xs text-center">Admin</h1>
          </div>
        </Link>
      </div>

      <main className="px-5 sm:px-10 py-8 flex-1 min-h-0 overflow-hidden">
        <div className="max-w-6xl mx-auto h-full flex flex-col">
          <div className="rounded-3xl border border-gray-200 bg-white shadow-sm p-6 flex-1 min-h-0 flex flex-col">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6 shrink-0">
              <div>
                <h2 className="font-bold text-xl md:text-2xl">
                  {entry.code} ({entry.title})
                </h2>
                <p className="mt-2 text-sm md:text-base text-gray-700">{entry.professor}</p>
              </div>

              <div className="w-full max-w-xs md:w-auto">
                <div className="relative">
                  <img
                    src={search}
                    alt="Search"
                    className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60"
                  />
                  <input
                    type="text"
                    placeholder="Search Student"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full rounded-full border border-gray-300 bg-[#F6F6F6] px-12 py-3 text-sm text-gray-700 outline-none transition focus:border-[#1C6100] focus:ring-2 focus:ring-[#1C6100]/20"
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto rounded-2xl border border-gray-200">
              <table className="min-w-full text-sm text-gray-700">
                <thead className="sticky top-0 z-10">
                  <tr className="border-b border-gray-200 bg-[#F8F8F8] text-left text-sm font-semibold text-gray-700">
                    <th className="px-4 py-3">Student Name</th>
                    <th className="px-4 py-3">Section</th>
                    <th className="px-4 py-3">Student Email</th>
                    <th className="px-4 py-3">Student Number</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-gray-400 italic">
                        No matching students.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s, idx) => (
                      <tr key={idx} className="border-b border-gray-100 last:border-b-0">
                        <td className="px-4 py-3">{s.name}</td>
                        <td className="px-4 py-3">{s.section}</td>
                        <td className="px-4 py-3 underline text-[#1C6100]">{s.email}</td>
                        <td className="px-4 py-3">{s.studentNumber}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReportSubject;
