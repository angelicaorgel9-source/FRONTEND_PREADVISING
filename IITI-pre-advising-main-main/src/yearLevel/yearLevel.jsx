import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import adminLogo from '../dashboard/dashboardLOGO/adminLogo.png';
import book from "../assets/photo/BOOK.png";

const years = [
  { name: "BSIT 1st Year",      yearLevel: 1 },
  { name: "BSIT 2nd Year",      yearLevel: 2 },
  { name: "BSIT 3rd Year",      yearLevel: 3 },
  { name: "BSIT 4th Year",      yearLevel: 4 },
  { name: "Irregular Students", yearLevel: null },
];

const YearLevel = () => {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    
    const regularYears = years.filter(y => y.yearLevel !== null);

    const sectionPromises = regularYears.map(y =>
      fetch(`/bridge/sections/${y.yearLevel}`)
        .then(r => r.json())
        .then(data => ({ key: y.yearLevel, count: Array.isArray(data.data) ? data.data.length : (data.data?.length ?? 0) }))
        .catch(() => ({ key: y.yearLevel, count: 0 }))
    );

    const irregularPromise = fetch('/bridge/students/irregular')
      .then(r => r.json())
      .then(data => ({ key: 'irregular', count: Array.isArray(data.data) ? data.data.length : (data.data?.students?.length ?? 0) }))
      .catch(() => ({ key: 'irregular', count: 0 }));

    Promise.all([...sectionPromises, irregularPromise]).then(results => {
      const map = {};
      results.forEach(r => { map[r.key] = r.count; });
      setCounts(map);
    });
  }, []);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-gray-100 font-RB box-border">
      <div className="p-5 pt-14 flex justify-between border-b-4 border-[#D9D9D9]">
        <h1 className="font-bold text-2xl p-5">Year Level</h1>
        <Link to="/profile">
          <div className="flex flex-col items-center cursor-pointer active:scale-95">
            <img src={adminLogo} alt="admin" className="h-10.5 w-10.5" />
            <h1 className="text-xs text-center">Admin</h1>
          </div>
        </Link>
      </div>

      <main className="px-5 sm:px-10 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 max-w-255 mx-auto">
          {years.map((year, index) => (
            <Link
              key={index}
              to="/section"
              state={
                year.yearLevel === null
                  ? { irregular: true, yearTitle: year.name }
                  : { yearLevel: year.yearLevel, yearTitle: year.name }
              }
            >
              <div className="bg-[#1C6100] w-full h-28 rounded-[15px] p-4 relative text-white shadow-lg hover:bg-green-800 transition-all duration-300 cursor-pointer">
                <h2 className="text-lg font-bold">{year.name}</h2>
                <p className="text-xs font-normal mt-1 opacity-80">
                  {year.yearLevel === null ? `No. of Students: ${counts['irregular'] ?? 0}` : `No. of Sections: ${counts[year.yearLevel] ?? 0}`}
                </p>
                <img src={book} alt="Book" className="absolute bottom-3 right-3 w-7 h-7 object-contain" />
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default YearLevel;