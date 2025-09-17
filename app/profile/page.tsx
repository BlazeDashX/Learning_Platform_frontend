"use client";
import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";
import { fetchData, TeacherProfile } from "@/lib/data";
import api from "@/lib/api";
import toast from "react-hot-toast";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import StarIcon from "@mui/icons-material/Star";
import BookIcon from "@mui/icons-material/Book";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_ENDPOINT

export default function ProfilePage() {
  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [tempData, setTempData] = useState<any>({});
  const [avatar, setAvatar] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [contactOpen, setContactOpen] = useState(true);
  const [careerOpen, setCareerOpen] = useState(true);
  const [qualOpen, setQualOpen] = useState(true);

  useEffect(() => {
    fetchData()
      .then(({ teacher }) => {
        setTeacher(teacher);
        setTempData({
          name: teacher.name,
          bio: teacher.bio || "",
          email: teacher.email,
          phone: teacher.phone || "",
          room: teacher.room || "",
          achievements: teacher.achievements || "",
          awards: teacher.awards || "",
          certifications: teacher.certifications || "",
          school: teacher.school || "",
          college: teacher.college || "",
          university: teacher.university || "",
          degree: teacher.degree || "",
          publications: teacher.publications || "",
        });
        setAvatar(teacher.profilePicture ? BACKEND_URL + teacher.profilePicture : null);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        toast.error("Failed to load profile ❌");
      });
  }, []);

  if (loading) return <div className="text-center mt-20 text-gray-700">Loading profile...</div>;

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.put<TeacherProfile>("/teacher/profile/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setTeacher(res.data);
      setAvatar(res.data.profilePicture ? BACKEND_URL + res.data.profilePicture : null);
      toast.success("Profile picture updated ✅");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to upload profile picture ❌");
    }
  };

  const handleSave = async () => {
    try {
      const res = await api.put<TeacherProfile>("/teacher/profile", tempData);
      setTeacher(res.data);
      setAvatar(res.data.profilePicture ? BACKEND_URL + res.data.profilePicture : null);
      setEditMode(false);
      toast.success("Profile updated successfully ✅");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update profile ❌");
    }
  };

  const handleCancel = () => {
    if (!teacher) return;
    setTempData({
      name: teacher.name,
      bio: teacher.bio || "",
      email: teacher.email,
      phone: teacher.phone || "",
      room: teacher.room || "",
      achievements: teacher.achievements || "",
      awards: teacher.awards || "",
      certifications: teacher.certifications || "",
      school: teacher.school || "",
      college: teacher.college || "",
      university: teacher.university || "",
      degree: teacher.degree || "",
      publications: teacher.publications || "",
    });
    setEditMode(false);
    toast("Changes discarded", { icon: "⚡" });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
  <Sidebar onCollapse={setSidebarCollapsed} />
  <main className="flex-1 p-8 transition-all duration-300">
        {/* Header */}
        <div className="w-full h-48 bg-gradient-to-r from-blue-600 to-indigo-700 relative shadow-md rounded-b-xl">
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <div className="relative w-36 h-36 rounded-full border-4 border-white overflow-hidden shadow-xl flex items-center justify-center bg-gray-200">
              {avatar ? (
                <img src={avatar} className="w-full h-full object-cover" />
              ) : (
                <span className="text-5xl font-bold text-gray-600">{teacher!.name[0].toUpperCase()}</span>
              )}
              {editMode && (
                <label className="absolute bottom-0 right-0 bg-black/60 hover:bg-black/80 p-2 rounded-full cursor-pointer text-white">
                  📷
                  <input type="file" className="hidden" onChange={handleAvatarChange} />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Name & Bio */}
        <div className="mt-20 text-center">
          {editMode ? (
            <input
              value={tempData.name}
              onChange={e => setTempData({ ...tempData, name: e.target.value })}
              className="text-3xl font-bold px-3 py-1 rounded-lg text-gray-800 border focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          ) : (
            <h1 className="text-3xl font-bold text-gray-900">{teacher!.name}</h1>
          )}

          {editMode ? (
            <textarea
              value={tempData.bio}
              onChange={e => setTempData({ ...tempData, bio: e.target.value })}
              className="mt-2 px-3 py-2 rounded-lg w-96 text-gray-800 border focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          ) : (
            <p className="mt-2 text-gray-600 italic">{teacher!.bio || "No bio added"}</p>
          )}
        </div>

        {/* Stats */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <StatCard icon={<StarIcon />} label="Achievements" value={tempData.achievements?.split(",").length || 0} />
          <StatCard icon={<BookIcon />} label="Publications" value={tempData.publications?.split(",").length || 0} />
          <StatCard icon={<EmojiEventsIcon />} label="Awards" value={tempData.awards?.split(",").length || 0} />
        </div>

        {/* Sections */}
        <CollapsibleSection title="Contact Information" open={contactOpen} setOpen={setContactOpen} icon={<PhoneIcon />}>
          <Card icon={<EmailIcon />} title="Email" value={tempData.email} tempData={tempData} setTempData={setTempData} field="email" editMode={editMode} />
          <Card icon={<PhoneIcon />} title="Phone" value={tempData.phone} tempData={tempData} setTempData={setTempData} field="phone" editMode={editMode} />
          <Card icon={<WorkIcon />} title="Room No" value={tempData.room} tempData={tempData} setTempData={setTempData} field="room" editMode={editMode} />
        </CollapsibleSection>

        <CollapsibleSection title="Career & Achievements" open={careerOpen} setOpen={setCareerOpen} icon={<StarIcon />}>
          <Card title="Achievements" value={tempData.achievements} tempData={tempData} setTempData={setTempData} field="achievements" type="textarea" editMode={editMode} />
          <Card title="Publications" value={tempData.publications} tempData={tempData} setTempData={setTempData} field="publications" type="textarea" editMode={editMode} />
          <Card title="Awards" value={tempData.awards} tempData={tempData} setTempData={setTempData} field="awards" type="textarea" editMode={editMode} />
          <Card title="Certifications" value={tempData.certifications} tempData={tempData} setTempData={setTempData} field="certifications" type="textarea" editMode={editMode} />
        </CollapsibleSection>

        <CollapsibleSection title="Qualification" open={qualOpen} setOpen={setQualOpen} icon={<SchoolIcon />}>
          <Card icon={<SchoolIcon />} title="School" value={tempData.school} tempData={tempData} setTempData={setTempData} field="school" editMode={editMode} />
          <Card icon={<SchoolIcon />} title="College" value={tempData.college} tempData={tempData} setTempData={setTempData} field="college" editMode={editMode} />
          <Card icon={<SchoolIcon />} title="University" value={tempData.university} tempData={tempData} setTempData={setTempData} field="university" editMode={editMode} />
          <Card icon={<WorkIcon />} title="Degree" value={tempData.degree} tempData={tempData} setTempData={setTempData} field="degree" editMode={editMode} />
        </CollapsibleSection>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-center gap-4">
          {editMode ? (
            <>
              <button className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold" onClick={handleSave}>
                Save
              </button>
              <button className="px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-semibold" onClick={handleCancel}>
                Cancel
              </button>
            </>
          ) : (
            <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold" onClick={() => setEditMode(true)}>
              Edit Info
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

// Stat Card
function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="flex items-center gap-3 bg-white shadow-md rounded-xl p-4 hover:shadow-xl transition w-40 justify-center">
      <div className="text-blue-500">{icon}</div>
      <div className="text-center">
        <span className="block text-lg font-semibold">{value}</span>
        <span className="text-gray-500 text-sm">{label}</span>
      </div>
    </div>
  );
}

function CollapsibleSection({ title, icon, children, open, setOpen }: any) {
  return (
    <div className="mt-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between cursor-pointer mb-4" onClick={() => setOpen(!open)}>
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">{icon && <span>{icon}</span>} {title}</h2>
        <span className="text-gray-500">{open ? "▲" : "▼"}</span>
      </div>
      {open && <div className="grid md:grid-cols-2 gap-6">{children}</div>}
    </div>
  );
}

function Card({ icon, title, value, tempData, setTempData, field, type = "text", editMode }: any) {
  const isReadOnly = field === "email";

  return (
    <div className="bg-white rounded-xl shadow p-5 flex flex-col hover:shadow-lg transition duration-200">
      <div className="flex items-center gap-2">
        {icon && <span className="text-blue-500">{icon}</span>}
        <span className="text-gray-500 font-medium">{title}</span>
      </div>
      {editMode && !isReadOnly ? (
        type === "textarea" ? (
          <textarea
            value={tempData[field]}
            onChange={e => setTempData({ ...tempData, [field]: e.target.value })}
            className="mt-2 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 w-full"
          />
        ) : (
          <input
            type={type}
            value={tempData[field]}
            onChange={e => setTempData({ ...tempData, [field]: e.target.value })}
            className="mt-2 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
          />
        )
      ) : (
        <span className="mt-2 text-gray-800 font-semibold">{value || "N/A"}</span>
      )}
    </div>
  );
}
