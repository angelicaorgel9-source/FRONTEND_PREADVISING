import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const HEADER_GREEN = [28, 97, 0]; // #1C6100

function addSchoolHeader(doc) {
  doc.setFontSize(13);
  doc.setTextColor(28, 97, 0);
  doc.text("Instituto ng Teknolohiya ng Impormasyon at Pagbabago", 14, 16);
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text("Report", 14, 23);
}

function addEntryTable(doc, entry, yearTitle, startY) {
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(`${yearTitle}`, 14, startY);
  doc.setFontSize(10);
  doc.text(`${entry.code} - ${entry.title}`, 14, startY + 6);
  doc.text(`Professor: ${entry.professor}`, 14, startY + 11);

  autoTable(doc, {
    startY: startY + 15,
    head: [["Student Name", "Section", "Student Email", "Student Number"]],
    body: entry.students.map((s) => [s.name, s.section, s.email, s.studentNumber]),
    headStyles: { fillColor: HEADER_GREEN, textColor: 255, fontSize: 9 },
    bodyStyles: { fontSize: 8.5 },
    theme: "grid",
    margin: { left: 14, right: 14 },
  });

  return doc.lastAutoTable.finalY;
}

// Builds one continuous PDF that lists every subject/professor record in
// sequence (each one's full table), used for "Print All" / "Export All".
function buildSequentialDoc(sections) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  addSchoolHeader(doc);
  let cursorY = 32;
  let first = true;

  sections.forEach(({ yearTitle, entry }) => {
    const estimatedHeight = 20 + entry.students.length * 6;
    if (!first && cursorY + estimatedHeight > 280) {
      doc.addPage();
      cursorY = 20;
    }
    first = false;
    cursorY = addEntryTable(doc, entry, yearTitle, cursorY) + 12;
  });

  return doc;
}

export function buildSubjectDoc(yearTitle, entry) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  addSchoolHeader(doc);
  addEntryTable(doc, entry, yearTitle, 32);
  return doc;
}

export function buildYearDoc(yearTitle, entries) {
  return buildSequentialDoc(entries.map((entry) => ({ yearTitle, entry })));
}

export function buildAllYearsDoc(yearsWithEntries) {
  const sections = [];
  yearsWithEntries.forEach(({ yearTitle, entries }) => {
    entries.forEach((entry) => sections.push({ yearTitle, entry }));
  });
  return buildSequentialDoc(sections);
}

export function downloadDoc(doc, filename) {
  doc.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
}

export function printDoc(doc) {
  doc.autoPrint();
  window.open(doc.output("bloburl"), "_blank");
}
