import React, { useState, useEffect } from "react";
import Close from "../assets/photo/Close.png";

const YEAR_LEVELS = [1, 2, 3, 4];
const ROWS_PER_SECTION = 10;

const emptyRow = {
  code: "",
  unit: "",
  hours: "",
  time: "",
  day: "",
  room: "",
  section: "",
  instructor: "",
};

const normalizeRow = (row = {}, fallbackSection = "") => ({
  code: row.code ?? row.subjectCode ?? row.subject ?? "",
  unit: row.unit ?? row.units ?? "",
  hours: row.hours ?? row.credits ?? row.creditHours ?? "",
  time: row.time ?? row.scheduleTime ?? "",
  day: row.day ?? row.days ?? "",
  room: row.room ?? row.location ?? "",
  section: row.section ?? fallbackSection,
  instructor: row.instructor ?? row.instructorName ?? row.faculty ?? row.instructor_name ?? "",
});

const ViewOverallSchedule = ({ show, onClose }) => {
  const [search, setSearch] = useState("");
  const [scheduleBySection, setScheduleBySection] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!show) return;

    setLoading(true);

    
    fetch("/bridge/overall-schedule")
      .then((r) => r.json())
      .then(async (data) => {
        if (data.success && data.data && Object.keys(data.data).length > 0) {
          const grouped = {};
          Object.entries(data.data).forEach(([section, rows]) => {
            grouped[section] = (Array.isArray(rows) ? rows : []).map((r) =>
              normalizeRow(r, section)
            );
          });
          setScheduleBySection(grouped);
          return;
        }

        
        const grouped = {};
        for (const yearLevel of YEAR_LEVELS) {
          try {
            const sectionsRes = await fetch(`/bridge/sections/${yearLevel}`).then((r) => r.json());
            const sectionNames = (sectionsRes?.data || []).map(
              (s) => s.name || s.section_name || s.section || ""
            );

            for (const sectionName of sectionNames) {
              if (!sectionName) continue;
              try {
                const schedRes = await fetch(
                  `/bridge/schedule/${encodeURIComponent(sectionName)}`
                ).then((r) => r.json());
                const rows = Array.isArray(schedRes?.data)
                  ? schedRes.data
                  : schedRes?.data?.rows || [];
                grouped[sectionName] = rows.map((r) => normalizeRow(r, sectionName));
              } catch {
                grouped[sectionName] = [];
              }
            }
          } catch {
            
          }
        }
        setScheduleBySection(grouped);
      })
      .catch(() => setScheduleBySection({}))
      .finally(() => setLoading(false));
  }, [show]);

  if (!show) return null;

  const filteredSections = Object.entries(scheduleBySection).filter(([section]) =>
    section.toLowerCase().includes(search.toLowerCase())
  );

  const SectionTable = ({ section, rows }) => {
    const padded = [...rows].slice(0, ROWS_PER_SECTION);
    while (padded.length < ROWS_PER_SECTION) padded.push({ ...emptyRow });

    return (
      <div className="mb-8">
        <h3 className="font-bold text-sm mb-2">{section}</h3>
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-white">
              <th className="border border-black p-1.5">Subject Code</th>
              <th className="border border-black p-1.5">Unit</th>
              <th className="border border-black p-1.5">Hours</th>
              <th className="border border-black p-1.5">Time</th>
              <th className="border border-black p-1.5">Days</th>
              <th className="border border-black p-1.5">Room</th>
              <th className="border border-black p-1.5">Section</th>
              <th className="border border-black p-1.5">Instructor's Name/Signature</th>
            </tr>
          </thead>
          <tbody>
            {padded.map((row, index) => (
              <tr key={index}>
                <td className="border border-black p-1.5 text-center">{row.code}</td>
                <td className="border border-black p-1.5 text-center">{row.unit}</td>
                <td className="border border-black p-1.5 text-center">{row.hours}</td>
                <td className="border border-black p-1.5 text-center whitespace-pre-line">
                  {row.time}
                </td>
                <td className="border border-black p-1.5 text-center whitespace-pre-line">
                  {row.day}
                </td>
                <td className="border border-black p-1.5 text-center">{row.room}</td>
                <td className="border border-black p-1.5 text-center">{row.section}</td>
                <td className="border border-black p-1.5 text-center">{row.instructor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 font-RB">
      <div className="bg-white w-[80vw] h-[90vh] rounded-xl shadow-lg flex flex-col">
        {/* HEADER */}
        <div className="flex justify-between items-center border-b border-black/30 p-6">
          <h2 className="text-lg font-semibold">Overall Schedule</h2>
          <img
            src={Close}
            alt="close"
            className="w-5 h-5 cursor-pointer"
            onClick={onClose}
          />
        </div>

        {/* CONTENT */}
        <div className="overflow-y-auto px-10 py-4">
          {/* SEARCH + PRINT */}
          <div className="flex items-center gap-4 mb-5">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search School Year"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 pl-4 pr-9 py-2 w-full rounded-md text-sm"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
            </div>
            <button
              onClick={() => window.print()}
              className="bg-[#1C6100] text-white px-6 py-2 rounded-md text-sm font-bold cursor-pointer hover:bg-green-800"
            >
              Print All Schedule
            </button>
          </div>

          {/* SECTION TABLES — every section from BSIT 1st year through 4th year */}
          {loading ? (
            <div className="text-center text-gray-500 mt-10">Loading schedules…</div>
          ) : filteredSections.length > 0 ? (
            filteredSections.map(([section, rows]) => (
              <SectionTable key={section} section={section} rows={rows} />
            ))
          ) : (
            <div className="text-center text-gray-500 mt-10">No results found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewOverallSchedule;
