import React, { useEffect, useRef, useState } from "react";

const ChangeScheduleModal = ({ show, subjectCode, currentSection, onCancel, onSave }) => {
  const [selectedSection, setSelectedSection] = useState(currentSection);

  // Draggable modal position (offset from centered position)
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragState = useRef(null);

  const handleDragStart = (e) => {
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: pos.x,
      origY: pos.y,
    };
    window.addEventListener("mousemove", handleDragMove);
    window.addEventListener("mouseup", handleDragEnd);
  };

  const handleDragMove = (e) => {
    if (!dragState.current) return;
    const { startX, startY, origX, origY } = dragState.current;
    setPos({ x: origX + (e.clientX - startX), y: origY + (e.clientY - startY) });
  };

  const handleDragEnd = () => {
    dragState.current = null;
    window.removeEventListener("mousemove", handleDragMove);
    window.removeEventListener("mouseup", handleDragEnd);
  };

  const scheduleList = [
    {
      section: "BSIT 1A",
      time: "07:00am - 10:00am\n02:00pm - 05:00pm",
      day: "Monday\nWednesday",
      room: "VT101",
      instructor: "",
    },
    {
      section: "BSIT 1B",
      time: "08:00am - 11:00am\n07:00am - 10:00am",
      day: "Friday\nSaturday",
      room: "VT102",
      instructor: "",
    },
    {
      section: "BSIT 1C",
      time: "03:00pm - 06:00pm\n10:00am - 01:00pm",
      day: "Thursday\nMonday",
      room: "VT103",
      instructor: "",
    },
  ];

  useEffect(() => {
    if (show) {
      setPos({ x: 0, y: 0 });
      setSelectedSection(currentSection);
    }
  }, [show, currentSection]);

  if (!show) return null;

  const handleSave = () => {
    const chosen = scheduleList.find((s) => s.section === selectedSection);
    if (chosen) onSave(chosen);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-70 font-RB">
      <div
        className="bg-white w-175 max-h-[80vh] rounded-lg shadow-lg p-6 overflow-auto fixed top-1/2 left-1/2"
        style={{ transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))` }}
      >
        <div
          className="cursor-grab active:cursor-grabbing select-none -m-6 mb-0 px-6 pt-6"
          onMouseDown={handleDragStart}
        >
          <h2 className="text-lg font-bold mb-1">Change Schedule</h2>
          <p className="text-sm text-gray-500 mb-4">Other Schedule for {subjectCode}</p>
        </div>

        <table className="w-full border-collapse mb-6">
          <thead>
            <tr className="bg-[#1C6100] text-white text-xs">
              <th className="border border-[#1C6100] p-2">Section</th>
              <th className="border border-[#1C6100] p-2">Time</th>
              <th className="border border-[#1C6100] p-2">Day</th>
              <th className="border border-[#1C6100] p-2">Room</th>
              <th className="border border-[#1C6100] p-2">Instructor</th>
              <th className="border border-[#1C6100] p-2"></th>
            </tr>
          </thead>
          <tbody className="text-xs">
            {scheduleList.map((sched, index) => (
              <tr key={index}>
                <td className="border p-2 text-center">{sched.section}</td>
                <td className="border p-2 text-center whitespace-pre-line">{sched.time}</td>
                <td className="border p-2 text-center whitespace-pre-line">{sched.day}</td>
                <td className="border p-2 text-center">{sched.room}</td>
                <td className="border p-2 text-center">{sched.instructor}</td>
                <td className="border p-2 text-center">
                  {selectedSection === sched.section ? (
                    <span className="text-gray-600">Currently Selected!</span>
                  ) : (
                    <button
                      onClick={() => setSelectedSection(sched.section)}
                      className="px-4 py-1 bg-[#1C6100] text-white rounded cursor-pointer hover:bg-green-800"
                    >
                      ADD
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-[#1C6100] text-white rounded cursor-pointer hover:bg-green-800"
          >
            Save
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-gray-300 rounded cursor-pointer hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeScheduleModal;
