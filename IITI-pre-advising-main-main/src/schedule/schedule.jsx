import { Link } from "react-router-dom";
import React, { useState } from "react";
import adminLogo from "../dashboard/dashboardLOGO/adminLogo.png";
import ViewOverallSchedule from "./viewOverallSchedule";

const Schedule = () => {
  const [showOverall, setShowOverall] = useState(false);
  const options = [
    "Overall Schedule",
    "BSIT 1st Year",
    "BSIT 2nd Year",
    "BSIT 3rd Year",
    "BSIT 4th Year",
  ];

  // options are hardcoded for now; backend endpoint doesn't exist
  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-100 font-RB">
      {/* HEADER */}
      <div className="p-5 pt-14 flex justify-between border-b-5 border-[#D9D9D9]">
        <h1 className="font-bold text-2xl p-5">Schedule</h1>

        <Link to="/profile">
          <div className="flex-col cursor-pointer active:scale-95">
            <img src={adminLogo} alt="admin" className="h-10.5 w-10.5" />
            <h1 className="text-xs text-center">Admin</h1>
          </div>
        </Link>
      </div>

      {/* CONTENT */}

      <main className="overflow-y-auto px-5 sm:px-14 py-6">
        <div className="space-y-5 px-7">
          {(options || []).map((item, index) => {
            if (item === "Overall Schedule") {
              return (
                <div
                  key={index}
                  onClick={() => setShowOverall(true)}
                  className="bg-[#1C6100] text-white rounded-xl px-5 py-3.5 shadow-md cursor-pointer hover:bg-green-700 transition"
                >
                  <h2 className="text-base font-bold">{item}</h2>
                </div>
              );
            }

            const match = item.match(/\d/);
            const yearNumber = match ? match[0] : "1";

            return (
              <Link
                key={index}
                to="/viewSection"
                state={{ year: yearNumber }}
                className="block"
              >
                <div className="bg-[#1C6100] text-white rounded-xl px-5 py-3.5 shadow-md cursor-pointer hover:bg-green-700 transition">
                  <h2 className="text-base font-bold">{item}</h2>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
      <ViewOverallSchedule
        show={showOverall}
        onClose={() => setShowOverall(false)}
      />
    </div>
  );
};

export default Schedule;
