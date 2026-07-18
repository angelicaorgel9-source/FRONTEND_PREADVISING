import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import arrow from "../assets/photo/arrow.png";
import next from "../assets/photo/next.png";
import adminLogo from "../dashboard/dashboardLOGO/adminLogo.png";
import ChangeSubjectModal from "./ChangeSubjectModal.jsx";
import ChangeScheduleModal from "./ChangeScheduleModal.jsx";

const emptySubject = () => ({
  id: `tmp-${Math.random().toString(36).slice(2, 9)}`,
  code: "",
  title: "",
  hours: "",
  unit: "",
  time: "",
  days: "",
  room: "",
  instructor: "",
  section: "",
});

const PreAdvisingSubjects = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const student = location.state?.student ?? {};
  const yearTitle = location.state?.yearTitle ?? "Year Level";

  const studentNumber = student.number ?? student.student_no ?? student.student_number ?? "";
  const studentName =
    student.name || `${student.first_name || ""} ${student.last_name || ""}`.trim();
  // Which semester's "allowed subjects" the Change Subject modal should pull from
  const semester = student.semester ?? "1st Semester 2025-2026";

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  // Row index currently being edited by each modal (null = closed)
  const [subjectModalRow, setSubjectModalRow] = useState(null);
  const [scheduleModalRow, setScheduleModalRow] = useState(null);

  useEffect(() => {
    if (!studentNumber) return;
    setLoading(true);
    fetch(`/bridge/student-subjects/${encodeURIComponent(studentNumber)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setSubjects(data.data.map((s) => ({ id: s.id ?? `${s.code}-${Math.random()}`, ...s })));
        } else {
          setSubjects([emptySubject()]);
        }
      })
      .catch(() => setSubjects([emptySubject()]))
      .finally(() => setLoading(false));
  }, [studentNumber]);

  const handleRemove = (index) => {
    setSubjects((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubjectSelected = (index, newSubject) => {
    setSubjects((prev) =>
      prev.map((row, i) =>
        i === index
          ? {
              ...row,
              code: newSubject.code,
              title: newSubject.title ?? "",
              hours: newSubject.hours ?? row.hours,
              unit: newSubject.unit ?? row.unit,
              // changing the subject invalidates the previously picked schedule
              time: "",
              days: "",
              room: "",
              instructor: "",
              section: "",
            }
          : row
      )
    );
    setSubjectModalRow(null);
  };

  const handleScheduleSelected = (index, newSchedule) => {
    setSubjects((prev) =>
      prev.map((row, i) =>
        i === index
          ? {
              ...row,
              time: newSchedule.time ?? row.time,
              days: newSchedule.day ?? newSchedule.days ?? row.days,
              room: newSchedule.room ?? row.room,
              instructor: newSchedule.instructor ?? row.instructor,
              section: newSchedule.section ?? row.section,
            }
          : row
      )
    );
    setScheduleModalRow(null);
  };

  const handleAddSubjectRow = () => {
    setSubjects((prev) => [...prev, emptySubject()]);
  };

  const handleSave = () => {
    fetch(`/bridge/student-subjects/${encodeURIComponent(studentNumber)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subjects }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) navigate(-1);
      })
      .catch(() => {});
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-[#F5F5F5] font-RB">
      <div className="w-full h-full min-h-0">
        {/* Header */}
        <div className="p-5 pt-14 flex justify-between items-start border-b-[5px] border-[#D9D9D9]">
          <div className="flex flex-col items-start gap-1 text-[20px]">
            <button onClick={() => navigate(-1)} className="cursor-pointer">
              <img src={arrow} alt="Back" className="w-4 h-4 active:scale-95" />
            </button>
            <div className="flex items-center gap-3 text-sm">
              <Link to="/pre-advising" className="font-bold text-black/50">
                Pre-Advising
              </Link>
              <img src={next} className="w-3 h-3" alt="" />
              <span className="font-bold text-black/50">{yearTitle}</span>
              <img src={next} className="w-3 h-3" alt="" />
              <span className="font-bold text-black">Student</span>
            </div>
          </div>

          <Link to="/profile">
            <div className="flex flex-col items-center cursor-pointer active:scale-95">
              <img src={adminLogo} className="h-10 w-10" alt="admin" />
              <h1 className="text-xs text-center">Admin</h1>
            </div>
          </Link>
        </div>

        {/* Main */}
        <main className="max-w-6xl mx-auto p-8 text-sm">
          <div className="mb-6 space-y-1">
            <p>
              <span className="font-semibold">Student Name</span>&nbsp;&nbsp;:&nbsp; {studentName || "—"}
            </p>
            <p>
              <span className="font-semibold">Student Number</span>&nbsp;:&nbsp; {studentNumber || "—"}
            </p>
          </div>

          {loading ? (
            <p className="text-center text-gray-500 py-6">Loading subjects…</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#1C6100] text-white text-xs">
                  <th className="border border-[#1C6100] p-2">Subject Code</th>
                  <th className="border border-[#1C6100] p-2">Hours</th>
                  <th className="border border-[#1C6100] p-2">Unit</th>
                  <th className="border border-[#1C6100] p-2">Time</th>
                  <th className="border border-[#1C6100] p-2">Days</th>
                  <th className="border border-[#1C6100] p-2">Room</th>
                  <th className="border border-[#1C6100] p-2">Instructor</th>
                  <th className="border border-[#1C6100] p-2">Section</th>
                  <th className="border border-[#1C6100] p-2">Edit</th>
                </tr>
              </thead>
              <tbody className="bg-white text-xs">
                {subjects.map((row, index) => (
                  <tr key={row.id ?? index}>
                    <td className="border p-2 text-center">{row.code}</td>
                    <td className="border p-2 text-center">{row.hours}</td>
                    <td className="border p-2 text-center">{row.unit}</td>
                    <td className="border p-2 text-center whitespace-pre-line">{row.time}</td>
                    <td className="border p-2 text-center whitespace-pre-line">{row.days}</td>
                    <td className="border p-2 text-center">{row.room}</td>
                    <td className="border p-2 text-center">{row.instructor}</td>
                    <td className="border p-2 text-center">{row.section}</td>
                    <td className="border p-2">
                      <div className="flex flex-wrap gap-1 justify-center">
                        <button
                          onClick={() => handleRemove(index)}
                          className="px-2 py-1 bg-gray-300 rounded text-[11px] cursor-pointer hover:bg-gray-400"
                        >
                          Remove
                        </button>
                        <button
                          onClick={() => setSubjectModalRow(index)}
                          className="px-2 py-1 bg-[#1C6100] text-white rounded text-[11px] cursor-pointer hover:bg-green-800"
                        >
                          Change Subject
                        </button>
                        <button
                          onClick={() => setScheduleModalRow(index)}
                          disabled={!row.code}
                          className="px-2 py-1 bg-[#1C6100] text-white rounded text-[11px] cursor-pointer hover:bg-green-800 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Change Schedule
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <button
            onClick={handleAddSubjectRow}
            className="mt-3 text-[#1C6100] text-xs font-semibold cursor-pointer hover:underline"
          >
            + Add another subject
          </button>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-[#1C6100] text-white rounded cursor-pointer hover:bg-green-800"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-300 rounded cursor-pointer hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </main>
      </div>

      {subjectModalRow !== null && (
        <ChangeSubjectModal
          show={subjectModalRow !== null}
          currentCode={subjects[subjectModalRow]?.code}
          semester={semester}
          studentNumber={studentNumber}
          onCancel={() => setSubjectModalRow(null)}
          onSave={(newSubject) => handleSubjectSelected(subjectModalRow, newSubject)}
        />
      )}

      {scheduleModalRow !== null && (
        <ChangeScheduleModal
          show={scheduleModalRow !== null}
          subjectCode={subjects[scheduleModalRow]?.code}
          currentSection={subjects[scheduleModalRow]?.section}
          onCancel={() => setScheduleModalRow(null)}
          onSave={(newSchedule) => handleScheduleSelected(scheduleModalRow, newSchedule)}
        />
      )}
    </div>
  );
};

export default PreAdvisingSubjects;
