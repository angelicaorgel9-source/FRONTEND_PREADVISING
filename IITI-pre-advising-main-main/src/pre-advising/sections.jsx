import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import back from "../assets/photo/arrow.png";
import adminLogo from "../dashboard/dashboardLOGO/adminLogo.png";
import next from "../assets/photo/next.png";

const BatchTable = () => {
  const [activeBatch, setActiveBatch] = useState("Batch 01");

  const batches = ["Batch 01", "Batch 02", "Batch 03", "Batch 04"];

  const navigate = useNavigate(); 
  const students = [
    {
      studentNo: "2024123456",
      name: "Cruz, Juan A.",
      status: "New Student",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
      <div className="flex flex-wrap gap-5 mb-6">
        {batches.map((batch) => (
          <button
            key={batch}
            onClick={() => setActiveBatch(batch)}
            className={`px-6 py-2.5 rounded-xl border text-sm font-semibold shadow-md transition-all duration-200
              ${
                activeBatch === batch
                  ? "bg-[#1C6100] text-white border-[#1C6100]"
                  : "bg-white text-black border-gray-400 hover:bg-gray-100"
              }`}
          >
            {batch}
          </button>
        ))}
      </div>

      <div className="border border-gray-300 rounded-md overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse table-fixed">
          
          <thead>
            <tr className="bg-[#1C6100] text-white">
              <th className="w-1/5 border border-[#2F7A17] py-3 text-sm font-medium">
                Student Number
              </th>
              <th className="w-1/3 border border-[#2F7A17] py-3 text-sm font-medium">
                Student Name
              </th>
              <th className="w-1/4 border border-[#2F7A17] py-3 text-sm font-medium">
                Status
              </th>
              <th className="border border-[#2F7A17]"></th>
            </tr>
          </thead>

          <tbody>
            {students.map((student, index) => (
              <tr
                key={index}
                className="h-12 cursor-pointer hover:bg-gray-50"
                onClick={() => navigate('/pre-advising-student')}
              >
                <td className="border border-gray-200 text-center text-sm">
                  {student.studentNo}
                </td>
                <td className="border border-gray-200 text-center text-sm">
                  {student.name}
                </td>
                <td className="border border-gray-200 text-center text-sm">
                  {student.status}
                </td>
                <td className="border border-gray-200"></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

const PreAdvisingSections = () => {
  const [search, setSearch] = useState("");
  const [sections, setSections] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  const yearLevel = location.state?.yearLevel ?? 1;
  const yearTitle = location.state?.yearTitle ?? `1st Year`;
  const isIrregular = location.state?.irregular ?? false;

  useEffect(() => {
    if (isIrregular) {
      navigate('/pre-advising-list', { state: { irregular: true, yearTitle }, replace: true });
    }
  }, [isIrregular, navigate, yearTitle]);

  useEffect(() => {
    if (isIrregular) return;
    fetch(`/bridge/sections/${yearLevel}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          const mapped = data.data.map((s) => ({
            name: s.name || s.section_name || s.section || "",
            active: s.active ?? false,
          }));
          setSections(mapped);
        }
      })
      .catch(() => {});
  }, [yearLevel, isIrregular]);

  const filteredSections = sections.filter((s) => (s.name || "").toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="h-full w-full max-w-full flex flex-col overflow-hidden bg-gray-100 font-RB box-border">

      {/* Header */}
      <div className="p-5 pt-14 flex justify-between border-b-5 border-[#D9D9D9] shrink-0">

        <div className="flex flex-col items-start gap-1 text-[1.5625rem]">
          <Link to="/pre-advising">
            <img src={back} alt="Back" className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-3">
            <span className="font-bold text-black/50">Pre-Advising</span>
            <img src={next} alt="Next" className="w-4 h-4" />
            <span className="font-bold text-black">{yearTitle === 'BSIT 1st Year' ? '1st Year' : yearTitle}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-[#E5E5E5] rounded-full px-4 py-2 w-65">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
            <div className="w-px h-5 bg-gray-400 mr-2"></div>
            <input
              type="text"
              placeholder="Search Student"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none text-sm w-full placeholder-gray-500"
            />
          </div>

          <Link to="/profile">
            <div className="flex-col cursor-pointer active:scale-95">
              <img src={adminLogo} alt="admin" className="h-10.5 w-10.5" />
              <h1 className="text-xs text-center">Admin</h1>
            </div>
          </Link>
        </div>

      </div>

      {/* Sections Grid */}
      <div className="p-6 flex flex-col gap-4 overflow-y-auto">
        {filteredSections.length > 0 && (
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
              {filteredSections.map((section, index) => (
                <div key={index} className="bg-white rounded-2xl border border-[#D5D5D5] shadow-md w-57.25 h-62.75 cursor-pointer hover:shadow-lg transition-all duration-200">
                  <Link to="/pre-advising-list" state={{ section: section.name, yearTitle, yearLevel }}>
                    <div className={`px-4 py-3 ${section.active ? "bg-green-700 text-white rounded-t-2xl" : ""}`}>
                      <h3 className={`font-semibold ${section.active ? "text-white" : "text-gray-700"}`}>
                        {section.name}
                      </h3>
                      <p className={`text-sm ${section.active ? "text-white" : "text-gray-500"}`}>
                        No. of Students Enrolled
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        <BatchTable />
      </div>

    </div>
  );
};

export default PreAdvisingSections;
