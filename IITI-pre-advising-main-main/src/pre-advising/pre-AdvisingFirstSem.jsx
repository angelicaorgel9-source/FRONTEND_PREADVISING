import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import arrow from "../assets/photo/arrow.png";
import next from "../assets/photo/next.png";
import adminLogo from "../dashboard/dashboardLOGO/adminLogo.png";

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

const StudentGrades = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const passedStudent = location.state?.student;
  const isIrregular = location.state?.isIrregular ?? location.state?.irregular ?? false;

  const [studentName, setStudentName] = useState(
    passedStudent?.name || `${passedStudent?.first_name || ""} ${passedStudent?.last_name || ""}`.trim() || ""
  );
  const [yearSection, setYearSection] = useState(passedStudent?.section || "");
  const [studentId, setStudentId] = useState(
    passedStudent?.number || passedStudent?.student_no || passedStudent?.student_number || ""
  );
  const [allGrades, setAllGrades] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const studentNumber =
      passedStudent?.number || passedStudent?.student_no || passedStudent?.student_number;
    if (!studentNumber) return;

    setLoading(true);
    setError("");

    fetch(`/bridge/student/${encodeURIComponent(studentNumber)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const student = data.data?.student || {};
          const grades = data.data?.grades || [];

          setStudentName(
            student.name || `${student.first_name || ""} ${student.last_name || ""}`.trim() || ""
          );
          setYearSection(student.section || "");
          setStudentId(
            student.number || student.student_no || student.student_number || studentNumber
          );
          setAllGrades(grades);

          const semMap = new Map();
          grades.forEach((grade) => {
            const label = buildSemLabel(grade);
            if (label) semMap.set(label, semesterSortKey(label));
          });

          const sortedSemesters = [...semMap.entries()]
            .sort((a, b) => b[1] - a[1])
            .map(([label]) => label);

          const uniqueSemesters = Array.from(new Set([...sortedSemesters, "Credited"]));
          setSemesters(uniqueSemesters);
          setSelectedSemester(uniqueSemesters[0] || "");
        } else {
          setError("Failed to load student grades.");
        }
      })
      .catch(() => {
        setError("Failed to load student grades.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [passedStudent]);

  const filteredGrades = allGrades.filter(
    (subject) => buildSemLabel(subject) === selectedSemester,
  );

  return (
    <div className="h-screen w-full overflow-hidden bg-[#F5F5F5] font-sans">
      <div className="w-full h-full min-h-0">
        {/* HEADER */}
        <div className="p-5 pt-14 flex justify-between items-start border-b-[5px] border-[#D9D9D9] sticky top-0 bg-gray-100 z-10">
          {/* LEFT */}
          <div className="flex flex-col items-start gap-1 text-[1.25rem]">
            <Link to="/section">
              <img src={arrow} alt="Back" className="w-4 h-4 cursor-pointer active:scale-95" />
            </Link>
            <div className="flex items-center gap-3">
              <span className="font-bold text-black/50">BSIT First Year Students</span>
              <img src={next} className="w-4 h-4" />
              <span className="font-bold text-black/50">Student</span>
            </div>
          </div>

          {/* RIGHT */}
          <Link to="/profile">
            <div className="flex flex-col items-center cursor-pointer active:scale-95">
              <img src={adminLogo} className="h-10 w-10" />
              <h1 className="text-xs text-center">Admin</h1>
            </div>
          </Link>
        </div>

        {/* MAIN */}
        <main className="max-w-6xl mx-auto p-8 text-sm">
          <div className="flex justify-between items-start mb-8">
            <div className="space-y-2">
              <h1>
                Name : <span className="ml-2">{studentName || "—"}</span>
              </h1>
              <h1>
                Year and Section : <span className="ml-2">{isIrregular ? "" : yearSection}</span>
              </h1>
            </div>
          </div>

          {/* Semester + ID */}
          <div className="flex justify-between items-center mb-10">
            <div className="flex flex-col">
              <label className="bg-[#F5F5F5] px-1 text-[0.625rem] text-gray-500">
                Select Semester
              </label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="border border-gray-400 px-4 py-2 pr-8 bg-white text-sm outline-none"
              >
                {semesters.length === 0 ? (
                  <option value="">No semesters available</option>
                ) : (
                  semesters.map((sem) => (
                    <option key={sem} value={sem}>{sem}</option>
                  ))
                )}
              </select>
            </div>

            <div className="border border-gray-300 bg-white shadow px-6 py-2 text-sm">
              Student Id : <span className="ml-2">{studentId || "—"}</span>
            </div>
          </div>

          {loading && <p className="text-center text-gray-500 py-4">Loading grades…</p>}
          {error && <p className="text-center text-red-500 py-4">{error}</p>}

          {!loading && (
            <>
              <div className="grid grid-cols-6 text-center text-sm mb-6 px-2">
                <div></div>
                <div>Prelim</div>
                <div>Midterm</div>
                <div>Pre-Final</div>
                <div>Final</div>
                <div>Final Grade</div>
              </div>

              <div className="space-y-2">
                {filteredGrades.length === 0 ? (
                  <div className="text-center py-6 text-gray-400 text-sm">
                    No grades found for this semester.
                  </div>
                ) : (
                  filteredGrades.map((subject, index) => {
                    const code = subject.code || subject.subject_code || "";
                    const title = subject.title || subject.subject_title || subject.subject || "";
                    const teacher = subject.instructor || subject.teacher || "";
                    const prelim = subject.prelim ?? subject.preliminary ?? "-";
                    const midterm = subject.midterm ?? "-";
                    const preFinal = subject.preFinal ?? subject.pre_final ?? "-";
                    const finalScore = subject.final ?? subject.final_score ?? "-";
                    const finalGrade =
                      subject.finalGrade ?? subject.final_grade ?? subject.grade ?? "-";

                    return (
                      <div
                        key={index}
                        className="grid grid-cols-6 items-center border-b border-gray-300 py-2 px-2 text-sm"
                      >
                        <div className="text-left">
                          <h2>{code}</h2>
                          <p className="text-[0.6875rem] text-gray-600">{teacher}</p>
                          <p className="text-[0.6875rem] text-gray-600">{title}</p>
                        </div>
                        <div className="text-center">{prelim}</div>
                        <div className="text-center">{midterm}</div>
                        <div className="text-center">{preFinal}</div>
                        <div className="text-center">{finalScore}</div>
                        <div className="text-center">{finalGrade}</div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentGrades;
