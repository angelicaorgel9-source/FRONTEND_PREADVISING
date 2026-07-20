import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import arrow from "../assets/photo/arrow.png";
import next from "../assets/photo/next.png";
import adminLogo from "../dashboard/dashboardLOGO/adminLogo.png";
import { PROFESSOR_OPTIONS, SUBJECT_OPTIONS, getYearData } from "./reportData";
import { buildSubjectDoc, buildYearDoc, downloadDoc, printDoc } from "./reportPdf";

const PREVIEW_COUNT = 3;

const ReportYear = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const yearLevel = location.state?.yearLevel;
  const yearTitle = location.state?.yearTitle ?? "Year Level";

  const [professor, setProfessor] = useState(location.state?.professor ?? "All Professors");
  const [subject, setSubject] = useState("All Subjects");

  const yearData = getYearData(yearLevel);

  const filteredEntries = useMemo(() => {
    if (!yearData) return [];
    return yearData.entries.filter((e) => {
      const matchesProfessor = professor === "All Professors" || e.professor === professor;
      const matchesSubject = subject === "All Subjects" || e.code === subject;
      return matchesProfessor && matchesSubject;
    });
  }, [yearData, professor, subject]);

  const handlePrintAll = () => printDoc(buildYearDoc(yearTitle, filteredEntries));
  const handleExportAll = () => downloadDoc(buildYearDoc(yearTitle, filteredEntries), `Report-${yearTitle}`);

  const handlePrintOne = (entry) => printDoc(buildSubjectDoc(yearTitle, entry));
  const handleExportOne = (entry) => downloadDoc(buildSubjectDoc(yearTitle, entry), `${entry.code}-${entry.professor}`);

  const goToSubject = (entry) => {
    navigate("/report/subject", {
      state: {
        yearLevel,
        yearTitle,
        code: entry.code,
        professor: entry.professor,
      },
    });
  };

  if (!yearData) {
    return (
      <div className="min-h-screen w-full bg-gray-100 font-RB p-10">
        <p className="text-gray-500">No data found for this year level.</p>
        <Link to="/report" className="text-[#1C6100] underline text-sm">
          Back to Report
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-gray-100 font-RB box-border">
      {/* Header */}
      <div className="p-5 pt-14 flex justify-between items-start border-b-5 border-[#D9D9D9]">
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

      <main className="px-5 sm:px-10 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Controls */}
          <div className="flex flex-wrap items-end gap-3 mb-6">
            <div className="flex flex-col">
              <label className="bg-gray-100 px-1 text-[10px] text-gray-500">
                Select Professor
              </label>
              <select
                value={professor}
                onChange={(e) => setProfessor(e.target.value)}
                className="border border-gray-400 px-4 py-3 pr-8 bg-white text-sm outline-none rounded-sm cursor-pointer h-12 min-w-[14rem]"
              >
                {PROFESSOR_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="bg-gray-100 px-1 text-[10px] text-gray-500">
                Select Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="border border-gray-400 px-4 py-3 pr-8 bg-white text-sm outline-none rounded-sm cursor-pointer h-12 min-w-[14rem]"
              >
                {SUBJECT_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handlePrintAll}
              className="px-5 py-3 bg-[#1C6100] text-white text-sm rounded-sm hover:bg-green-800 active:scale-95 cursor-pointer h-12 min-w-[7rem]"
            >
              Print All
            </button>
            <button
              onClick={handleExportAll}
              className="px-5 py-3 bg-[#1C6100] text-white text-sm rounded-sm hover:bg-green-800 active:scale-95 cursor-pointer h-12 min-w-[7rem]"
            >
              Export All
            </button>
          </div>

          {/* Subject / Professor Cards */}
          <div className="space-y-6">
            {filteredEntries.length === 0 && (
              <p className="text-gray-400 italic text-sm">No records match this filter.</p>
            )}

            {filteredEntries.map((entry, idx) => (
              <div
                key={`${entry.code}-${entry.professor}-${idx}`}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
              >
                <div className="bg-[#1C6100] text-white flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 rounded-t-2xl">
                  <span className="font-bold text-sm">
                    {entry.code} - {entry.professor}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePrintOne(entry)}
                      className="px-4 py-2 bg-white text-[#1C6100] text-sm rounded-sm hover:bg-gray-100 active:scale-95 cursor-pointer"
                    >
                      Print
                    </button>
                    <button
                      onClick={() => handleExportOne(entry)}
                      className="px-4 py-2 bg-white text-[#1C6100] text-sm rounded-sm hover:bg-gray-100 active:scale-95 cursor-pointer"
                    >
                      Export
                    </button>
                  </div>
                </div>

                <div className="px-4 py-4 min-h-[3rem] flex justify-between items-start gap-4">
                  <div className="text-sm text-gray-800 space-y-1">
                    {entry.students.slice(0, PREVIEW_COUNT).map((s, i) => (
                      <p key={i}>
                        {s.name}&nbsp;&nbsp;&nbsp;{s.studentNumber}&nbsp;&nbsp;&nbsp;{s.section}
                      </p>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 whitespace-nowrap">
                    Total Students: {entry.students.length}
                  </p>
                </div>

                <div className="px-4 pb-3 flex justify-end">
                  <button
                    onClick={() => goToSubject(entry)}
                    className="text-sm text-gray-500 hover:text-[#1C6100] cursor-pointer"
                  >
                    See More &gt;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReportYear;
