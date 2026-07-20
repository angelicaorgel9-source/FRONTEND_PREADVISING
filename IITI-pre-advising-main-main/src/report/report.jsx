import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import adminLogo from "../dashboard/dashboardLOGO/adminLogo.png";
import { PROFESSOR_OPTIONS, REPORT_DATA } from "./reportData";
import { buildAllYearsDoc, downloadDoc, printDoc } from "./reportPdf";

const PREVIEW_COUNT = 3;

const Report = () => {
  const navigate = useNavigate();
  const [professor, setProfessor] = useState("All Professors");

  const filteredYears = useMemo(() => {
    return REPORT_DATA.map((year) => {
      const entries =
        professor === "All Professors"
          ? year.entries
          : year.entries.filter((e) => e.professor === professor);
      return { ...year, entries };
    });
  }, [professor]);

  const buildDocForAll = () =>
    buildAllYearsDoc(
      filteredYears
        .filter((y) => y.entries.length > 0)
        .map((y) => ({ yearTitle: y.yearTitle, entries: y.entries }))
    );

  const handlePrintAll = () => printDoc(buildDocForAll());
  const handleExportAll = () => downloadDoc(buildDocForAll(), "Report-All-Years");

  const goToYear = (year) => {
    navigate("/report/year", {
      state: { yearLevel: year.yearLevel, yearTitle: year.yearTitle, professor },
    });
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-gray-100 font-RB box-border">
      {/* Header */}
      <div className="p-5 pt-14 flex justify-between border-b-4 border-[#D9D9D9]">
        <h1 className="font-bold text-2xl p-5">Report</h1>
        <Link to="/profile">
          <div className="flex flex-col items-center cursor-pointer active:scale-95">
            <img src={adminLogo} alt="admin" className="h-10.5 w-10.5" />
            <h1 className="text-xs text-center">Admin</h1>
          </div>
        </Link>
      </div>

      <main className="px-5 sm:px-8 py-8">
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

          {/* Year Level Cards */}
          <div className="space-y-6">
            {filteredYears.map((year) => (
              <div
                key={year.yearLevel}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
              >
                <div className="bg-[#1C6100] text-white font-bold text-sm px-4 py-2.5 rounded-t-2xl">
                  {year.yearTitle}
                </div>
                <div className="px-4 py-4 text-sm text-gray-800 space-y-1 min-h-[3rem]">
                  {year.entries.length === 0 && (
                    <p className="text-gray-400 italic">No records for this professor.</p>
                  )}
                  {year.entries.slice(0, PREVIEW_COUNT).map((entry, idx) => (
                    <p key={idx}>
                      {entry.code} - {entry.professor}
                    </p>
                  ))}
                </div>
                <div className="px-4 pb-3 flex justify-end">
                  <button
                    onClick={() => goToYear(year)}
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

export default Report;
