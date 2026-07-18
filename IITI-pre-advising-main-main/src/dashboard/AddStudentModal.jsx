import { useState } from "react";
import { X } from "lucide-react";

const initialFormState = {
  surname: "",
  firstName: "",
  middleName: "",
  gender: "",
  yearLevel: "",
  studentStatus: "Freshmen (New)",
};

export default function AddStudentModal({
  isOpen = true,
  onClose = () => {},
  onSave = () => {},
}) {
  const [form, setForm] = useState(initialFormState);

  if (!isOpen) return null;

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = () => {
    onSave(form);
  };

  const handleCancel = () => {
    setForm(initialFormState);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-sm bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between bg-green-800 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">Add New Student</h2>
          <button
            type="button"
            onClick={handleCancel}
            aria-label="Close"
            className="text-white/90 transition hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-3 px-6 py-6">
          <input
            type="text"
            placeholder="Surname:"
            value={form.surname}
            onChange={handleChange("surname")}
            className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-500 focus:border-green-700 focus:outline-none focus:ring-1 focus:ring-green-700"
          />

          <input
            type="text"
            placeholder="First Name:"
            value={form.firstName}
            onChange={handleChange("firstName")}
            className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-500 focus:border-green-700 focus:outline-none focus:ring-1 focus:ring-green-700"
          />

          <input
            type="text"
            placeholder="Middle Name:"
            value={form.middleName}
            onChange={handleChange("middleName")}
            className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-500 focus:border-green-700 focus:outline-none focus:ring-1 focus:ring-green-700"
          />

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Gender:"
              value={form.gender}
              onChange={handleChange("gender")}
              className="w-1/2 rounded-sm border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-500 focus:border-green-700 focus:outline-none focus:ring-1 focus:ring-green-700"
            />
            <input
              type="text"
              placeholder="Year/Level:"
              value={form.yearLevel}
              onChange={handleChange("yearLevel")}
              className="w-1/2 rounded-sm border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-500 focus:border-green-700 focus:outline-none focus:ring-1 focus:ring-green-700"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-gray-500">
              Student Status
            </label>
            <select
              value={form.studentStatus}
              onChange={handleChange("studentStatus")}
              className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm focus:border-green-700 focus:outline-none focus:ring-1 focus:ring-green-700"
            >
              <option>Freshmen (New)</option>
              <option>Regular</option>
              <option>Irregular</option>
              <option>Transferee</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            type="button"
            onClick={handleSave}
            className="rounded-sm bg-green-800 px-5 py-2 text-sm font-medium text-white transition hover:bg-green-900"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-sm bg-gray-300 px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
