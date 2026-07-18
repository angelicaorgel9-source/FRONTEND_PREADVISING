import React, { useEffect, useRef, useState } from "react";
import "./dashboard.css";
import { Link } from "react-router-dom";
import adminLogo from "./dashboardLOGO/adminLogo.png";
import search from "../assets/photo/search.png";

function Dashboard() {
  const [students, setStudents] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalRegular, setTotalRegular] = useState(0);
  const [totalIrregular, setTotalIrregular] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const [lookupStudentName, setLookupStudentName] = useState("");
  const [lookupStudentId, setLookupStudentId] = useState("");
  const [lookupYearSection, setLookupYearSection] = useState("");
  const [lookupAllGrades, setLookupAllGrades] = useState([]);
  const [lookupGrades, setLookupGrades] = useState([]);
  const [lookupSemesterOptions, setLookupSemesterOptions] = useState([]);
  const [lookupSelectedSemester, setLookupSelectedSemester] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");

  // Floating "subject history" mini table
  const [activeSubjectCode, setActiveSubjectCode] = useState(null);
  const [subjectPopupTop, setSubjectPopupTop] = useState(0);
  const subjectTableRef = useRef(null);
  const subjectPopupRef = useRef(null);

  const buildSemLabel = (grade) => {
    const raw = grade.semester || "";
    const sy = grade.schoolYear || grade.school_year || "";

    if (/semester/i.test(raw) && /\d{4}/.test(raw)) return raw;

    const ordinals = { "1": "1st", "2": "2nd", "3": "3rd" };
    const semOrd = ordinals[String(raw).trim()] || `${raw}`;

    if (!sy || sy.toString().trim() === "") return "Credited";
    return `${semOrd} Semester ${sy}`;
  };

  const semesterSortKey = (label) => {
    if (label === "Credited") return -1;
    const match = label.match(/(\d+)(?:st|nd|rd|th)?\s+Semester\s+(\d{4})/i);
    if (!match) return 0;
    return parseInt(match[2]) * 10 + parseInt(match[1]);
  };

  const getSemesterOptions = (grades) => {
    const semMap = new Map();
    grades.forEach((grade) => {
      const label = buildSemLabel(grade);
      if (label) semMap.set(label, semesterSortKey(label));
    });

    const sorted = [...semMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([label]) => label);

    if (!sorted.includes("Credited")) sorted.push("Credited");
    return sorted;
  };

  const getGradesForSemester = (grades, semester) =>
    grades.filter((grade) => buildSemLabel(grade) === semester);

  const loadStudentById = (id) => {
    const studentId = String(id || "").trim();
    if (!studentId) return;

    setLookupLoading(true);
    setLookupError("");

    fetch(`/bridge/student/${encodeURIComponent(studentId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const student = data.data?.student || {};
          const grades = data.data?.grades || [];
          const studentNumber =
            student.number || student.student_no || student.student_number || studentId;
          const studentName =
            student.name || `${student.first_name || ""} ${student.last_name || ""}`.trim();

          setLookupStudentName(studentName);
          setLookupStudentId(studentNumber);
          setLookupYearSection(student.section || "");
          setLookupAllGrades(grades);

          const semOptions = getSemesterOptions(grades);
          setLookupSemesterOptions(semOptions);
          const selected = semOptions[0] || "";
          setLookupSelectedSemester(selected);
          setLookupGrades(getGradesForSemester(grades, selected));
        } else {
          setLookupError("Student information not found.");
          setLookupGrades([]);
          setLookupAllGrades([]);
          setLookupSemesterOptions([]);
        }
      })
      .catch(() => {
        setLookupError("Failed to load student grades.");
        setLookupGrades([]);
        setLookupAllGrades([]);
        setLookupSemesterOptions([]);
      })
      .finally(() => setLookupLoading(false));
  };

  const handleSelectStudent = (student) => {
    const studentId =
      student.number || student.student_no || student.student_number || student.id;
    if (!studentId) return;
    loadStudentById(studentId);
  };

  const handleStudentIdKeyDown = (e) => {
    if (e.key === "Enter") {
      loadStudentById(lookupStudentId);
    }
  };

  useEffect(() => {
    if (!lookupSelectedSemester) return;
    setLookupGrades(getGradesForSemester(lookupAllGrades, lookupSelectedSemester));
  }, [lookupAllGrades, lookupSelectedSemester]);

  const refreshDashboard = () => {
    fetch('/bridge/dashboard')
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setStudents(data.data.students)
          setTotalStudents(data.data.total_students)
          setTotalRegular(data.data.total_regular)
          setTotalIrregular(data.data.total_irregular)
        }
      })
  };

  useEffect(() => {
    refreshDashboard();
  }, [])

  // Close the subject-history popup when clicking outside of it
  useEffect(() => {
    if (!activeSubjectCode) return;
    const handleOutsideClick = (e) => {
      if (
        subjectPopupRef.current &&
        !subjectPopupRef.current.contains(e.target)
      ) {
        setActiveSubjectCode(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [activeSubjectCode]);

  const getSubjectHistory = (code) =>
    lookupAllGrades.filter(
      (g) => (g.code || g.subject_code || "") === code
    );

  const handleSubjectRowClick = (e, grade) => {
    const code = grade.code || grade.subject_code || "";
    if (!code) return;

    if (activeSubjectCode === code) {
      setActiveSubjectCode(null);
      return;
    }

    const rowRect = e.currentTarget.getBoundingClientRect();
    const containerRect = subjectTableRef.current?.getBoundingClientRect();
    if (containerRect) {
      setSubjectPopupTop(
        rowRect.bottom - containerRect.top + (subjectTableRef.current?.scrollTop || 0)
      );
    }
    setActiveSubjectCode(code);
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden font-RB box-border">
      <div>
        {/*Title and admin*/}
        <div
          className="px-5 pt-2 flex justify-between
                            border-b-5 border-[#D9D9D9]"
        >
          <h1 className="font-bold text-2xl p-5">Dashboard</h1>
          <Link to="/profile">
            <div className="flex-col cursor-pointer active:scale-95">
              <img src={adminLogo} alt="admin" className="h-10.5 w-10.5" />
              <h1 className="text-xs text-center">Admin</h1>
            </div>
          </Link>
        </div>

        {/* MAIN CONTENT */}
        <div className="grid w-full max-w-full gap-2 p-3 box-border">
          {/* FIRST ROW */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
            {/* TOP LEFT - Student Tabs */}
            <div className="rounded-lg p-3.5">
                <div className="flex w-full gap-2 mb-4">
                <button className="flex-1 bg-[#1C6100] text-white text-sm px-4 py-1.5 rounded-md">
                  Total Student: {totalStudents}
                </button>
                <button className="flex-1 border text-sm px-4 py-1.5 rounded-md text-gray-500">
                  Regular Student: {totalRegular}
                </button>
                <button className="flex-1 border text-sm px-4 py-1.5 rounded-md text-gray-500 bg-[#FFF8E7]">
                  Irregular Student: {totalIrregular}
                </button>
              </div>
            </div>

            {/* TOP RIGHT - Upload only */}
            <div className="flex flex-col gap-2">

              {/* Box 1: Upload Grades - own separate box */}
              <label
                htmlFor="uploadGrades"
                className="flex items-center justify-between w-full bg-[#1C6100] text-white text-sm font-semibold px-4 py-4 rounded-md cursor-pointer hover:bg-green-800 active:scale-95 shrink-0"
              >
                <span>Upload Grades</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 16 12 12 8 16" />
                  <line x1="12" y1="12" x2="12" y2="21" />
                  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                </svg>
                <input
                  id="uploadGrades"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const formData = new FormData();
                    formData.append("file", file);
                    try {
                      const res = await fetch("/bridge/upload-grades", {
                        method: "POST",
                        body: formData,
                      });
                      const data = await res.json();
                      if (data.success) alert(data.message);
                      else alert("Upload failed: " + data.error);
                    } catch (err) {
                      alert("Upload error: " + err.message);
                    }
                    e.target.value = "";
                  }}
                />
              </label>
            </div>

          </div>

          {/* BOTTOM ROW */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
            {/* LEFT - Student Management */}
            <div className="border rounded-lg p-3.5 flex flex-col gap-2 bg-white shadow-sm min-w-0">
              <h2 className="border-b pb-1.5 text-sm font-semibold text-gray-500 mb-3">
                Student Management
              </h2>

              {/* Search */}
              <div className="flex flex-col gap-2 mb-3 sm:flex-row sm:items-center">
                <div className="flex items-center w-full border rounded-md px-2 py-1">
                  <input
                    type="text"
                    className="text-sm outline-none w-full"
                    placeholder="Search Student"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <img src={search} alt="search" className="w-4 h-4 ml-2" />
                </div>
              </div>

              {/* Table */}
              <div className="mx-auto w-full max-w-full overflow-x-auto rounded-md max-h-90 overflow-y-auto">
                <div className="w-full min-w-0 overflow-hidden rounded-md border border-[#D9D9D9]/50 shadow-sm">
                  <div className="grid min-w-[640px] grid-cols-[1fr_2fr_0.8fr_0.7fr] bg-[#1C6100] text-white text-sm">
                    <span className="px-2 py-2 border-r border-white/30 text-left">Student Number</span>
                    <span className="px-2 py-2 border-r border-white/30 text-left">Name</span>
                    <span className="px-2 py-2 border-r border-white/30 text-center">Status</span>
                    <span className="px-2 py-2 text-center">Action</span>
                  </div>
                  {(() => {
                    const filteredStudents = (students || []).filter((s) =>
                      (s.name || `${s.first_name || ''} ${s.last_name || ''}`.trim()).toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (s.number ?? s.student_no ?? s.student_number ?? '').toString().includes(searchQuery) ||
                      (s.status ?? '').toLowerCase().includes(searchQuery.toLowerCase())
                    );

                    if (filteredStudents.length > 0) {
                      return filteredStudents.map((s, i) => (
                        <div
                          key={i}
                          onClick={() => handleSelectStudent(s)}
                          className="grid min-w-[640px] grid-cols-[1fr_2fr_0.8fr_0.7fr] text-sm h-10 items-center border-b border-[#D9D9D9]/50 cursor-pointer hover:bg-gray-100"
                        >
                          <span className="px-2 border-r border-[#D9D9D9]/50 h-full flex items-center min-w-0 truncate">
                            {s.number ?? s.student_no ?? s.student_number ?? s.id ?? "—"}
                          </span>
                          <span className="px-2 border-r border-[#D9D9D9]/50 h-full flex items-center min-w-0 truncate">
                            {s.name || `${s.first_name || ""} ${s.last_name || ""}`.trim() || "-"}
                          </span>
                          <span className="px-2 border-r border-[#D9D9D9]/50 h-full flex items-center justify-center min-w-0 truncate">
                            {s.status ?? "—"}
                          </span>
                          <span className="px-2 h-full flex items-center justify-center min-w-0">
                            {(() => {
                              const studentId = s.number ?? s.student_no ?? s.student_number ?? s.id ?? '';
                              return (
                                <Link
                                  to={`/viewGrade?id=${encodeURIComponent(studentId)}`}
                                  state={{ student: s, from: 'dashboard', studentId }}
                                  className="text-sm text-blue-600"
                                >
                                  View
                                </Link>
                              );
                            })()}
                          </span>
                        </div>
                      ));
                    }

                    return (
                      <div className="flex flex-col items-center justify-center py-4 text-gray-400">
                        <p className="text-sm font-semibold">No students found</p>
                        {searchQuery && (
                          <p className="text-xs mt-1">No results for "<span className="text-gray-600">{searchQuery}</span>"</p>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* RIGHT - Student Info + Subjects */}
            <div className="border rounded-lg p-3.5 flex flex-col gap-2">
              {/* Student Info Fields */}
              <input
                type="text"
                placeholder="Student Name:"
                value={lookupStudentName}
                onChange={(e) => setLookupStudentName(e.target.value)}
                className="border rounded-md p-1.5 text-sm w-full"
              />
              <input
                type="text"
                placeholder="Student ID:"
                value={lookupStudentId}
                onChange={(e) => setLookupStudentId(e.target.value)}
                onKeyDown={handleStudentIdKeyDown}
                className="border rounded-md p-1.5 text-sm w-full"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Year Level:"
                  value=""
                  readOnly
                  className="border rounded-md p-1.5 text-sm w-1/2 bg-[#F5F5F5]"
                />
                <input
                  type="text"
                  placeholder="Section:"
                  value={lookupYearSection}
                  readOnly
                  className="border rounded-md p-1.5 text-sm w-1/2 bg-[#F5F5F5]"
                />
              </div>

              {/* Subject Table */}
              <div className="border border-[#D9D9D9]/50 rounded-md overflow-hidden relative">
                <div ref={subjectTableRef} className="relative max-h-80 overflow-x-auto overflow-y-auto">
                  <div className="relative min-w-[420px]">
                    {/* Subject Table Header */}
                    <div className="grid grid-cols-[70px_1fr_50px_110px] bg-[#1C6100] text-white text-sm text-center">
                      <span className="px-2 py-2 border-r border-white/30">Code</span>
                      <span className="px-2 py-2 border-r border-white/30">Subject Title</span>
                      <span className="px-2 py-2 border-r border-white/30">Units</span>
                      <span className="px-2 py-2">Status</span>
                    </div>

                {lookupLoading ? (
                  <div className="py-8 text-center text-gray-500">Loading grades…</div>
                ) : lookupGrades.length > 0 ? (
                  lookupGrades.map((grade, index) => {
                    const statusRaw = (grade.status || "").toLowerCase();
                    const passed = ["completed", "credited", "passed"].includes(statusRaw);
                    const statusLabel = passed ? "Completed" : "Incomplete";
                    const statusColor = passed ? "text-green-600" : "text-red-500";
                    const code = grade.code || grade.subject_code || "";
                    const title = grade.title || grade.subject_title || grade.subject || "";
                    const units = grade.units ?? grade.unit ?? "";

                    return (
                      <div
                        key={index}
                        onClick={(e) => handleSubjectRowClick(e, grade)}
                        className={`grid grid-cols-[70px_1fr_50px_110px] text-sm h-8 items-center border-b border-[#D9D9D9]/50 cursor-pointer hover:bg-gray-100 ${
                          activeSubjectCode === code ? "bg-gray-100" : ""
                        }`}
                      >
                        <span className="px-2 border-r border-[#D9D9D9]/50 h-full flex items-center">
                          {code}
                        </span>
                        <span className="px-2 border-r border-[#D9D9D9]/50 h-full flex items-center truncate">
                          {title}
                        </span>
                        <span className="px-2 border-r border-[#D9D9D9]/50 h-full flex items-center justify-center">
                          {units}
                        </span>
                        <span className={`px-2 h-full flex items-center justify-center ${statusColor}`}>
                          {statusLabel}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                    <p className="text-sm font-semibold">No grades found</p>
                    {lookupError ? (
                      <p className="text-xs mt-1 text-red-500">{lookupError}</p>
                    ) : null}
                  </div>
                )}
                  </div>

                  {/* Floating subject history mini table */}
                  {activeSubjectCode && (
                    <div
                      ref={subjectPopupRef}
                      style={{ top: subjectPopupTop }}
                      className="absolute left-2 right-2 z-20 bg-white border border-[#D9D9D9] rounded-md shadow-lg overflow-hidden"
                    >
                      <div className="bg-[#1C6100] text-white text-sm font-semibold px-3 py-1.5">
                        {activeSubjectCode}
                      </div>
                      <div className="grid grid-cols-[1.2fr_1.4fr_0.8fr] bg-[#F5F5F5] text-xs font-semibold text-gray-600 text-center">
                        <span className="px-2 py-1 border-r border-[#D9D9D9]/70">Date</span>
                        <span className="px-2 py-1 border-r border-[#D9D9D9]/70">Instructor</span>
                        <span className="px-2 py-1">Grade</span>
                      </div>
                      {getSubjectHistory(activeSubjectCode).map((g, i) => (
                        <div
                          key={i}
                          className="grid grid-cols-[1.2fr_1.4fr_0.8fr] text-xs text-center border-t border-[#D9D9D9]/50"
                        >
                          <span className="px-2 py-1.5 border-r border-[#D9D9D9]/50">
                            {buildSemLabel(g)}
                          </span>
                          <span className="px-2 py-1.5 border-r border-[#D9D9D9]/50 truncate">
                            {g.instructor || "—"}
                          </span>
                          <span className="px-2 py-1.5">
                            {g.finalGrade ?? g.grade ?? "—"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;