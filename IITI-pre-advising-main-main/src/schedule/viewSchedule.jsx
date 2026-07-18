import { useState, useEffect } from "react";
import Close from "../assets/photo/Close.png";
import ConfirmModal from "./ConfirmModal";

const ViewSchedule = ({ show, onClose, yearSection }) => {
  const scheduleColumns = [
    "code",
    "unit",
    "hours",
    "time",
    "day",
    "room",
    "section",
    "instructor",
  ];

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

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(
    "1st Semester 2025-2026",
  );

  const [firstSemesterRows, setFirstSemesterRows] = useState(
    Array(10)
      .fill(null)
      .map(() => ({ ...emptyRow })),
  );
  const [secondSemesterRows, setSecondSemesterRows] = useState(
    Array(10)
      .fill(null)
      .map(() => ({ ...emptyRow })),
  );

  const normalizeRow = (row = {}) => ({
    code: row.code ?? row.subjectCode ?? row.subject ?? "",
    unit: row.unit ?? row.units ?? "",
    hours: row.hours ?? row.credits ?? row.creditHours ?? "",
    time: row.time ?? row.scheduleTime ?? "",
    day: row.day ?? row.days ?? "",
    room: row.room ?? row.location ?? "",
    section: row.section ?? yearSection ?? "",
    instructor:
      row.instructor ?? row.instructorName ?? row.faculty ?? row.instructor_name ?? "",
  });

  useEffect(() => {
    if (!show || !yearSection) return;

    const firstEmpty = Array(10).fill(null).map(() => ({ ...emptyRow }));
    const secondEmpty = Array(10).fill(null).map(() => ({ ...emptyRow }));

    const sectionParam = encodeURIComponent(yearSection);
    const semesterParam = encodeURIComponent(selectedSemester);
    const url = `/bridge/schedule/${sectionParam}?semester=${semesterParam}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.debug("ViewSchedule fetch", { url, data });

        const payload = data?.data ?? data;
        let firstSchedule = [];
        let secondSchedule = [];

        if (Array.isArray(payload)) {
          if (selectedSemester.toLowerCase().startsWith("1st")) {
            firstSchedule = payload;
          } else {
            secondSchedule = payload;
          }
        } else if (payload && typeof payload === "object") {
          firstSchedule =
            payload["1st Semester"] ??
            payload["First Semester"] ??
            payload.firstSemester ??
            payload.first ??
            [];
          secondSchedule =
            payload["2nd Semester"] ??
            payload["Second Semester"] ??
            payload.secondSemester ??
            payload.second ??
            [];

          if (!firstSchedule.length && !secondSchedule.length) {
            const maybeSem = payload["semester"]?.toString()?.toLowerCase();
            if (maybeSem && Array.isArray(payload.rows)) {
              if (maybeSem.includes("1st")) {
                firstSchedule = payload.rows;
              } else {
                secondSchedule = payload.rows;
              }
            }
          }
        }

        setFirstSemesterRows(
          firstSchedule.slice(0, 10).map(normalizeRow).concat(firstEmpty).slice(0, 10),
        );
        setSecondSemesterRows(
          secondSchedule.slice(0, 10).map(normalizeRow).concat(secondEmpty).slice(0, 10),
        );
      })
      .catch((error) => {
        console.debug("ViewSchedule fetch error", { url, error });
      });
  }, [show, yearSection, selectedSemester]);

  if (!show) return null;

  
  const rows =
    selectedSemester === "1st Semester 2025-2026"
      ? firstSemesterRows
      : secondSemesterRows;
  const setRows =
    selectedSemester === "1st Semester 2025-2026"
      ? setFirstSemesterRows
      : setSecondSemesterRows;

  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 font-RB">
      <div className="bg-white w-[80vw] h-[85vh] rounded-lg shadow-lg p-10 relative overflow-auto">
        {/* Top */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl">Class Schedule</h1>
            <h2>{yearSection}</h2>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 cursor-pointer"
          >
            <img src={Close} alt="Close" />
          </button>
        </div>

        {/* Semester Selector */}
        <div className="relative inline-block border border-gray-400 rounded px-3 pt-3 pb-2 mb-4">
          <span className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-500">
            Select Semester
          </span>

          <select
            className="bg-white text-base focus:outline-none pr-1"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
          >
            <option>1st Semester 2025-2026</option>
            <option>2nd Semester 2025-2026</option>
          </select>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[720px] table-fixed border">
          <thead>
            <tr className="text-sm">
              <th className="border p-2">SUBJECT CODE</th>
              <th className="border p-2">UNIT</th>
              <th className="border p-2">HOURS</th>
              <th className="border p-2">TIME</th>
              <th className="border p-2">DAYS</th>
              <th className="border p-2">ROOM</th>
              <th className="border p-2">SECTION</th>
              <th className="border p-2">INSTRUCTOR'S NAME/SIGNATURE</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                {scheduleColumns.map((col) => (
                  <td key={col} className="border p-1.5">
                    <input
                      type="text"
                      value={row[col]}
                      onChange={(e) => handleChange(index, col, e.target.value)}
                      className="w-full text-center outline-none py-1"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        <button
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
          onClick={() => setShowConfirm(true)}
        >
          Clear Schedule
        </button>
      </div>
      <ConfirmModal
        show={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => {
          setRows(
            Array(10)
              .fill(null)
              .map(() => ({ ...emptyRow })),
          );
          setShowConfirm(false);
        }}
      />
    </div>
  );
};

export default ViewSchedule;
