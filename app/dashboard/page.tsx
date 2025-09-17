"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { fetchData, TeacherProfile, ClassItem } from "@/lib/data";
import api from "@/lib/api";
import { Bar } from "react-chartjs-2";

import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { color } from "framer-motion";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

export default function Dashboard() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showCreateClass, setShowCreateClass] = useState(false);
  const [newClassTitle, setNewClassTitle] = useState("");
  const [newClassDesc, setNewClassDesc] = useState("");

  const router = useRouter();

 useEffect(() => {
  fetchData()
    .then(({ teacher, classes }) => {
      setTeacher(teacher);
      setClasses(classes);
    })
    .catch(() => router.push("/signin"));
}, [router]);


  const handleCreateClass = async () => {
    if (!newClassTitle) return alert("Title is required");
    try {
      await api.post<ClassItem>("/teacher/class", {
        title: newClassTitle,
        description: newClassDesc,
      });
      setNewClassTitle("");
      setNewClassDesc("");
      setShowCreateClass(false);
      const { classes } = await fetchData();
      setClasses(classes);
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || "Failed to create class");
    }
  };

  const handleDeleteClass = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await api.delete<{ message: string }>(`/teacher/class/${id}`);
      alert(res.data.message || "Class deleted");
      setClasses(classes.filter(c => c.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || "Failed to delete class");
    }
  };

  const handleLogout = async () => {
    try { await api.post("/auth/logout"); } catch {}
    router.push("/signin");
  };

  const handleClassClick = (classId: number) => router.push(`/dashboard/${classId}`);

  const totalStudents = classes.reduce((acc, c) => acc + (c.students?.length || 0), 0);
  const averageScore =
    classes.reduce((acc, c) => acc + (c.avgScore || 0), 0) / (classes.length || 1);

  const classChartData = {
  labels: classes.map(c => c.title),
  datasets: [
    {
      label: "Average Score",
      data: classes.map(c => c.avgScore),
      borderRadius: 6,
      backgroundColor: classes.map(() =>
        "linear-gradient(180deg, rgba(14,165,233,0.9), rgba(34,197,94,0.8))"
      ),
      borderColor: "rgba(0, 0, 0, 0.8)",
      borderWidth: 1,
      hoverBackgroundColor: classes.map(() =>
        "rgba(14,165,233,1)"
      ),
    },
  ],
};

 const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { mode: "index" as const, intersect: false },
    datalabels: {
      anchor: "end" as const,
      align: "end" as const,
      color: "#000000ff",
      font: { weight: "bold" as const, size: 12 },
      formatter: (value: number) => value,
    },
  },
  scales: {
    y: {
      max: 100,
      min: 0,
      ticks: { stepSize: 10 },
      grid: { color: "rgba(181, 20, 20, 0.82)" },
    },
    x: {
      grid: { display: true, color: "black" },
      ticks: { color: "#000" },
    },
  },
};
  return (
   <div className="flex min-h-screen text-white bg-gradient-to-br from-green-600 via-teal-700 to-cyan-800">
  <Sidebar
    onCollapse={(collapsed) => setSidebarOpen(!collapsed)}
    onLogout={handleLogout}
  />

  <main
    className={`flex-1 p-6 transition-all duration-300
      ${sidebarOpen ? "ml-60" : "ml-20"} md:ml-0`}
  >
<div className="flex flex-col items-end mb-6 relative">

  <button
    onClick={() => setShowCreateClass(!showCreateClass)}
    className="bg-green-500 px-4 py-2 rounded-xl font-semibold hover:bg-green-600 transition"
  >
    + Create Class
  </button>
  <div
    className={`mt-2 w-full max-w-xl bg-white/10 p-6 rounded-2xl shadow transition-all overflow-hidden ${
      showCreateClass ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
    }`}
    style={{ transition: "all 0.3s ease" }}
  >
    <input
      type="text"
      placeholder="Class Title"
      value={newClassTitle}
      onChange={(e) => setNewClassTitle(e.target.value)}
      className="w-full mb-3 px-4 py-2 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none"
    />
    <input
      type="text"
      placeholder="Class Description"
      value={newClassDesc}
      onChange={(e) => setNewClassDesc(e.target.value)}
      className="w-full mb-3 px-4 py-2 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none"
    />
    <div className="flex gap-4 justify-end">
      <button
        onClick={handleCreateClass}
        className="bg-green-500 px-6 py-2 rounded-xl font-semibold hover:bg-green-600 transition"
      >
        Create
      </button>
      <button
        onClick={() => setShowCreateClass(false)}
        className="bg-gray-500 px-6 py-2 rounded-xl font-semibold hover:bg-gray-600 transition"
      >
        Cancel
      </button>
    </div>
  </div>
</div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 p-5 rounded-2xl shadow hover:scale-105 transition-transform">
            <h3 className="text-lg font-semibold text-gray-200">Total Classes</h3>
            <p className="text-2xl mt-2 font-bold">{classes.length}</p>
          </div>
          <div className="bg-white/10 p-5 rounded-2xl shadow hover:scale-105 transition-transform">
            <h3 className="text-lg font-semibold text-gray-200">Total Students</h3>
            <p className="text-2xl mt-2 font-bold">{totalStudents}</p>
          </div>
          <div className="bg-white/10 p-5 rounded-2xl shadow hover:scale-105 transition-transform">
            <h3 className="text-lg font-semibold text-gray-200">Average Quiz Score</h3>
            <p className="text-2xl mt-2 font-bold">{averageScore.toFixed(1)}%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-1 space-y-4">
            {classes.map(cls => (
              <div
                key={cls.id}
                className="bg-white/10 p-4 rounded-2xl shadow hover:scale-105 hover:bg-white/20 transition cursor-pointer"
                onClick={() => handleClassClick(cls.id)}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">{cls.title}</h3>
                  <button
                    onClick={e => { e.stopPropagation(); handleDeleteClass(cls.id); }}
                    className="bg-red-500 px-3 py-1 rounded-xl font-semibold hover:bg-red-600 transition text-sm"
                  >
                    Delete
                  </button>
                </div>
                <p className="text-gray-200 text-sm">{cls.description || "No description"}</p>
              </div>
            ))}
          </section>

          <div className="lg:col-span-2 bg-gray-50/90 p-4 rounded-2xl shadow h-96 text-black">
            <h2 className="text-lg font-semibold mb-3">Class Performance Overview</h2>
            <Bar data={classChartData} options={chartOptions} />
          </div>

        </div>
      </main>
    </div>
  );
}
