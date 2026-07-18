import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import arrow from "../assets/photo/arrow.png";
import next from "../assets/photo/next.png";
import adminLogo from "../dashboard/dashboardLOGO/adminLogo.png";

const PreAdvisingList = () => {
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);
  const location = useLocation();
  const section = location.state?.section ?? "1A";
  const isIrregular = location.state?.irregular ?? false;

  useEffect(() => {
    const url = isIrregular ? '/bridge/students/irregular' : `/bridge/students/${section}`;
    fetch(url)
      .then(r => r.json())
      .then(data => { if (data.success) setStudents(data.data) })
      .catch(() => {})
  }, [section, isIrregular])

  const filteredStudents = (students || []).filter((student) =>
    (student.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (student.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (student.number || "").toString().includes(search)
  );

  return (
    <div className="h-screen w-full overflow-hidden bg-gray-100 font-sans">
      
      {/* Header */}
      <div className="p-5 pt-14 flex justify-between border-b-5 border-[#D9D9D9] items-center">
        <div className="flex flex-col items-start gap-1 text-[1.5625rem]">
          <Link to="/pre-advising">
            <img src={arrow} alt="Back" className="w-4 h-4" />
          </Link>
            <div className="flex items-center gap-3">
              <span className="font-bold text-black/50">Pre-Advising</span>
              <img src={next} alt="Next" className="w-3 h-3 opacity-50" />
              <span className="font-bold text-black">{location.state?.yearTitle ?? 'Students'}</span>
            </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-[#E5E5E5] rounded-full px-4 py-1.5 w-60">
            <input
              type="text"
              placeholder="Search Student"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none text-xs w-full placeholder-gray-500"
            />
          </div>

          <Link to="/profile">
            <div className="flex-col cursor-pointer active:scale-95 text-center">
              <img src={adminLogo} alt="admin" className="h-10 w-10 mx-auto" />
              <h1 className="text-xs">Admin</h1>
            </div>
          </Link>
        </div>
      </div>

      <main className="px-8 py-6 h-[calc(100vh-6.5rem)] overflow-hidden">
        {/* Table Header */}
        <div className="flex px-4 mb-2 text-gray-700 font-semibold text-[1rem]">
          <div className="w-1/4">Student Name</div>
          <div className="w-1/6 text-center">Section</div>
          <div className="w-1/3">Student Email</div>
          <div className="w-1/4 text-center">Student Number</div>
        </div>

        {/* Student List Container */}
        <div className="shadow-sm">
          <div className="overflow-y-auto">
            <div className="px-4 flex flex-col space-y-1">
              
              {/* Dynamic Student Rows */}
{filteredStudents.length > 0 ? (
  filteredStudents.map((student, index) => (
    <Link 
      key={index} 
      to={`/viewGrade?id=${encodeURIComponent(student.number ?? student.student_no ?? student.student_number ?? student.id ?? '')}`} 
      state={{
        student,
        studentId: student.number ?? student.student_no ?? student.student_number ?? student.id ?? '',
        from: 'pre-advising',
        yearTitle: location.state?.yearTitle,
        irregular: location.state?.irregular ?? false,
      }}
      className="block no-underline"
    >
      <div className="flex border bg-[#D9D9D9]/50 border-black hover:bg-gray-200 cursor-pointer h-6 items-center px-2 text-sm transition-colors">
        <div className="w-1/4">{student.name}</div>
        <div className="w-1/6 text-center">{student.section}</div>
        <div className="w-1/3 text-xs">{student.email}</div>
        <div className="w-1/4 text-center">{student.number}</div>
      </div>
    </Link>
  ))
) : (
  <div className="flex flex-col items-center justify-center py-10 text-gray-400">
    <p className="text-sm font-semibold">No students found</p>
    {search && (
      <p className="text-xs mt-1">No results for "<span className="text-gray-600">{search}</span>"</p>
    )}
  </div>
)}

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PreAdvisingList;