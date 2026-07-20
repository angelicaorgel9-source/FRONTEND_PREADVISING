// Mock data source for the Report module.
// Replace the fetch-able parts of this file with real /bridge/... calls
// once the backend endpoints for reports are available — the shape
// (yearLevels -> entries -> students) is kept intentionally simple so the
// swap is a drop-in.

export const PROFESSOR_OPTIONS = [
  "All Professors",
  "Carmeli Samson",
  "Raymond Gonzales",
  "Jaime Chico",
  "Florentino Casuco",
  "Jonathan Morano",
];

export const SUBJECT_OPTIONS = [
  "All Subjects",
  "CC101",
  "PFT61",
  "PFT63",
  "CC105",
  "IPT102",
  "PF101",
  "CC106",
  "CAP102",
  "SSP85",
  "SIA102",
];

const firstNames = [
  "Juan", "Jose", "Kyler", "Maybelline", "Andrea", "Miguel",
  "Samantha", "Rafael", "Isabel", "Gabriel", "Camille", "Nathaniel",
  "Danica", "Elijah",
];
const lastNames = [
  "Dela Cruz", "Dimaano", "Eusebio", "Faustino", "Guevarra", "Herrera",
  "Ilagan", "Javier", "Katigbak", "Lozada", "Mercado", "Navarro",
  "Ocampo", "Pascual",
];

function pad(num, size) {
  return String(num).padStart(size, "0");
}

function generateStudents(yearLevel, seedOffset, count = 14) {
  const students = [];
  for (let i = 0; i < count; i++) {
    const last = lastNames[(i + seedOffset) % lastNames.length];
    const first = firstNames[(i + seedOffset) % firstNames.length];
    const studentNumber = `202${yearLevel}${pad(seedOffset * 20 + i, 4)}`;
    const section = `${yearLevel}${i % 2 === 0 ? "A" : "B"}`;
    students.push({
      name: `${last}, ${first}`,
      section,
      email: `${studentNumber}@btech.ph.education`,
      studentNumber,
    });
  }
  return students;
}

// entries: { code, title, professor, students }
export const REPORT_DATA = [
  {
    yearLevel: 1,
    yearTitle: "BSIT 1st Year",
    entries: [
      { code: "CC101", title: "Introduction to Computing", professor: "Carmeli Samson", students: generateStudents(1, 0) },
      { code: "PFT61", title: "Physical Fitness and Training 1", professor: "Raymond Gonzales", students: generateStudents(1, 1) },
      { code: "PFT61", title: "Physical Fitness and Training 1", professor: "Prof. 2", students: generateStudents(1, 2) },
      { code: "NSTP", title: "National Service Training Program", professor: "Prof. 1", students: generateStudents(1, 3) },
    ],
  },
  {
    yearLevel: 2,
    yearTitle: "BSIT 2nd Year",
    entries: [
      { code: "CC105", title: "Data Structures and Algorithms", professor: "Carmeli Samson", students: generateStudents(2, 0) },
      { code: "PF101", title: "Professional Elective 1", professor: "Florentino Casuco", students: generateStudents(2, 1) },
      { code: "PFT63", title: "Physical Fitness and Training 3", professor: "Prof. 1", students: generateStudents(2, 2) },
    ],
  },
  {
    yearLevel: 3,
    yearTitle: "BSIT 3rd Year",
    entries: [
      { code: "CC106", title: "Object-Oriented Programming", professor: "Carmeli Samson", students: generateStudents(3, 0) },
      { code: "CC106", title: "Object-Oriented Programming", professor: "Prof. 2", students: generateStudents(3, 1) },
      { code: "IPT102", title: "IT Elective 2", professor: "Jaime Chico", students: generateStudents(3, 2) },
    ],
  },
  {
    yearLevel: 4,
    yearTitle: "BSIT 4th Year",
    entries: [
      { code: "CAP102", title: "Capstone Project 2", professor: "Jonathan Morano", students: generateStudents(4, 0) },
      { code: "SIA102", title: "Systems Integration and Architecture 2", professor: "Prof. 1", students: generateStudents(4, 1) },
      { code: "SSP85", title: "Social and Professional Issues", professor: "Prof. 1", students: generateStudents(4, 2) },
    ],
  },
];

export function getYearData(yearLevel) {
  return REPORT_DATA.find((y) => y.yearLevel === Number(yearLevel));
}

export function getEntry(yearLevel, code, professor) {
  const year = getYearData(yearLevel);
  if (!year) return null;
  return year.entries.find((e) => e.code === code && e.professor === professor) || null;
}
