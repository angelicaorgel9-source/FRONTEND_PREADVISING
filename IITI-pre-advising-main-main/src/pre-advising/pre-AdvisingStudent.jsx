import React, { useState } from "react";
import { Link } from "react-router-dom";
import back from "../assets/photo/arrow.png";
import adminLogo from "../dashboard/dashboardLOGO/adminLogo.png";
import next from "../assets/photo/next.png";
import ChangeSubjectModal from "./ChangeSubjectModal";
import ChangeScheduleModal from "./ChangeScheduleModal";

export default function StudentSchedule() {
  const [search, setSearch] = useState("");
  const [showChangeSubjectModal, setShowChangeSubjectModal] = useState(false);
  const [selectedSubjectCode, setSelectedSubjectCode] = useState(null);
  const [showChangeScheduleModal, setShowChangeScheduleModal] = useState(false);
  const [selectedScheduleSubject, setSelectedScheduleSubject] = useState(null);
  const [selectedScheduleSection, setSelectedScheduleSection] = useState(null);
  const yearTitle = "1st Year";

  const subjects = [
    {
      code: "CC101",
      hours: "3",
      unit: "3",
      time: "07:00am - 10:00am\n02:00pm - 05:00pm",
      days: "Monday\nWednesday",
      room: "VT101",
      instructor: "",
      section: "BSIT 1-C",
    },
  ];

  return (
    <div className="h-screen w-full max-w-full overflow-hidden bg-gray-100 font-RB box-border">
      {/* Header */}
      <div className="p-5 pt-14 flex justify-between border-b-5 border-[#D9D9D9]">
        <div className="flex flex-col items-start gap-1 text-[1.5625rem]">
          <Link to="/Pre-advising-sections">
            <img src={back} alt="Back" className="w-4 h-4" />
          </Link>

          <div className="flex items-center gap-3">
            <span className="font-bold text-black/50">Pre-Advising</span>
            <img src={next} alt="Next" className="w-4 h-4" />
            <span className="font-bold text-black/50">{yearTitle}</span>
            <img src={next} alt="Next" className="w-4 h-4" />
            <span className="font-bold text-black">Student</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-[#E5E5E5] rounded-full px-4 py-2 w-65">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-gray-500 mr-2"
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

            <div className="w-px h-5 bg-gray-400 mr-2"></div>

            <input
              type="text"
              placeholder="Search Section"
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

      <div className="p-5 bg-white h-[calc(100vh-6.5rem)] overflow-hidden">
        <div className="mb-6 space-y-1">
          <div className="flex items-center text-lg font-bold">
            <span className="w-48">Student Name</span>
            <span className="mx-3">:</span>
            <span>Cruz, Juan A.</span>
          </div>

          <div className="flex items-center text-lg font-bold">
            <span className="w-48">Student Number</span>
            <span className="mx-3">:</span>
            <span>0000000000</span>
          </div>
        </div>

        <div className="border border-gray-300 overflow-hidden">
          <table className="w-full border-collapse table-fixed">
            <thead>
              <tr className="bg-[#1C6100] text-white text-sm">
                <th className="border border-[#2F7A17] py-3 w-24">Subject Code</th>
                <th className="border border-[#2F7A17] w-14">Hours</th>
                <th className="border border-[#2F7A17] w-10">Unit</th>
                <th className="border border-[#2F7A17] w-24">Time</th>
                <th className="border border-[#2F7A17] w-20">Days</th>
                <th className="border border-[#2F7A17] w-24">Room</th>
                <th className="border border-[#2F7A17] w-44">Instructor</th>
                <th className="border border-[#2F7A17] w-28">Section</th>
                <th className="border border-[#2F7A17] w-44">Edit</th>
              </tr>
            </thead>

            <tbody>
              {subjects.map((subject, index) => (
                <tr key={index} className="h-14">
                  <td className="border border-gray-200 px-2">{subject.code}</td>
                  <td className="border border-gray-200 text-center">{subject.hours}</td>
                  <td className="border border-gray-200 text-center">{subject.unit}</td>
                  <td className="border border-gray-200 text-[10px] whitespace-pre-line px-2">{subject.time}</td>
                  <td className="border border-gray-200 text-[10px] whitespace-pre-line text-center">{subject.days}</td>
                  <td className="border border-gray-200 text-center">{subject.room}</td>
                  <td className="border border-gray-200 px-2">{subject.instructor}</td>
                  <td className="border border-gray-200 text-center">{subject.section}</td>
                  <td className="border border-gray-200">
                    <div className="flex justify-center gap-2">
                      <button className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-full text-xs">Remove</button>
                      <button 
                        onClick={() => {
                          setSelectedSubjectCode(subject.code);
                          setShowChangeSubjectModal(true);
                        }}
                        className="bg-[#1C6100] hover:bg-[#155000] text-white px-3 py-1 rounded-full text-xs"
                      >
                        Change Subject
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedScheduleSubject(subject.code);
                          setSelectedScheduleSection(subject.section);
                          setShowChangeScheduleModal(true);
                        }}
                        className="bg-[#1C6100] hover:bg-[#155000] text-white px-3 py-1 rounded-full text-xs"
                      >
                        Change Schedule
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex gap-6 mt-8 ml-4">
          <button className="bg-[#1C6100] hover:bg-[#155000] text-white px-10 py-3 rounded-xl font-medium shadow">Save</button>
          <button className="bg-gray-300 hover:bg-gray-400 text-black px-10 py-3 rounded-xl font-medium shadow">Cancel</button>
        </div>
      </div>

      <ChangeSubjectModal
        show={showChangeSubjectModal}
        currentCode={selectedSubjectCode}
        semester="1"
        studentNumber="0000000000"
        onCancel={() => setShowChangeSubjectModal(false)}
        onSave={(subject) => {
          console.log("Subject saved:", subject);
          setShowChangeSubjectModal(false);
        }}
      />

      <ChangeScheduleModal
        show={showChangeScheduleModal}
        subjectCode={selectedScheduleSubject}
        currentSection={selectedScheduleSection}
        onCancel={() => setShowChangeScheduleModal(false)}
        onSave={(schedule) => {
          console.log("Schedule saved:", schedule);
          setShowChangeScheduleModal(false);
        }}
      />
    </div>
  );
}
