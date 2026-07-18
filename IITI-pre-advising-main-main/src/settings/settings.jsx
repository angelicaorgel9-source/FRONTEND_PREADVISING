import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom'
import ExitModal from './ExitModal'

const EditProfile = () => {
  // State for each input field
  const [fullName, setFullName] = useState("Admin Dela Cruz");
  const [username, setUsername] = useState("Admin");
  const [gsuite, setGsuite] = useState("999999999999");
  const [position, setPosition] = useState("Admin");

  // State to toggle readonly/editable
  const [editFields, setEditFields] = useState({
    fullName: false,
    username: false,
    gsuite: false,
    position: false,
  });

  // Toggle edit mode for a field
  const toggleEdit = (field) => {
    setEditFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  useEffect(() => {
    fetch('/bridge/profile')
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          const p = data.data || {}
          setFullName(p.full_name ?? p.fullName ?? p.name ?? fullName)
          setUsername(p.username ?? username)
          setGsuite(p.gsuite ?? gsuite)
          setPosition(p.position ?? position)
        }
      })
      .catch(() => {})
  }, [])

  const handleFileUpload = async (e) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/bridge/profile/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.success) {
        alert('Profile picture updated!')
      } else {
        alert('Upload failed: ' + (data.error || 'Unknown error'))
      }
    } catch (err) {
      alert('Upload failed: ' + err.message)
    } finally {
      // clear the input value so same file can be uploaded again if needed
      if (e.target) e.target.value = ''
    }
  }

  const navigate = useNavigate()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const performLogout = () => {
    try {
      localStorage.removeItem('user')
    } catch (e) {
      // ignore
    }
    navigate('/login')
  }

  return (
    <div className="min-h-screen w-full bg-[#F5F5F5] font-RB">
      {/* HEADER */}
      <div className="bg-white shadow px-6 py-4 flex items-center justify-between border-b-[5px] border-[#D9D9D9]">
        <span className="text-[1.5625rem] font-bold text-black">Profile</span>
      </div>

      {/* PROFILE CONTENT */}
      <div className="px-10 py-10">
        {/* Profile Info */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7 text-black"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.7 0 4.8-2.2 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8V22h19.2v-2.8c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </div>
          <h2 className="text-[1.25rem] font-bold text-black">{fullName}</h2>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mb-10">
          <input
            type="file"
            id="profilePicInput"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />
          <button
            onClick={() => document.getElementById('profilePicInput').click()}
            className="bg-green-700 text-white text-sm px-5 py-2 rounded-full"
          >
            Upload New
          </button>
          <button className="bg-gray-200 text-gray-400 text-sm px-5 py-2 rounded-full cursor-not-allowed">
            Remove Profile Picture
          </button>
        </div>

        {/* removed earlier logout placement; button will appear under Position */}

        {/* Title */}
        <h3 className="text-[1.25rem] font-bold mb-6 text-black">Edit Profile</h3>

        {/* Form */}
        <div className="space-y-6">
          {/* Full Name */}
          <EditableField
            label="Full Name"
            value={fullName}
            setValue={setFullName}
            editable={editFields.fullName}
            toggleEdit={() => toggleEdit("fullName")}
          />
          {/* Username */}
          <EditableField
            label="Username"
            value={username}
            setValue={setUsername}
            editable={editFields.username}
            toggleEdit={() => toggleEdit("username")}
          />
          {/* Gsuite */}
          <EditableField
            label="Gsuite"
            value={gsuite}
            setValue={setGsuite}
            editable={editFields.gsuite}
            toggleEdit={() => toggleEdit("gsuite")}
          />
          {/* Position */}
          <EditableField
            label="Position"
            value={position}
            setValue={setPosition}
            editable={editFields.position}
            toggleEdit={() => toggleEdit("position")}
          />
          <div className="mt-10">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-red-500 text-white text-sm px-5 py-2 rounded-full hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>

          <ExitModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={() => {
              setIsModalOpen(false)
              performLogout()
            }}
          />
        </div>
      </div>
    </div>
  );
};

// Reusable Editable Field Component
const EditableField = ({ label, value, setValue, editable, toggleEdit }) => {
  const inputRef = useRef(null)

  const handleContainerClick = () => {
    if (!editable) {
      toggleEdit()
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }

  return (
    <div>
      <label className="text-[0.75rem] text-gray-500">{label}</label>
      <div
        className="mt-2 w-full max-w-127 min-h-14.5 bg-white border border-gray-300 rounded-[20px] flex items-center px-5 cursor-text"
        onClick={handleContainerClick}
      >
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full bg-transparent outline-none text-[0.875rem] text-gray-700"
          readOnly={!editable}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  )
}

export default EditProfile;