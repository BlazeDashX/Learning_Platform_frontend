"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

interface StudentItem {
  id: number;
  name: string;
  email: string;
  age: number;
  averageScore: number;
  classId: number;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentItem | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
  const fetchStudents = async () => {
    try {
      const res = await api.get<StudentItem[]>("/teacher/students");
      setStudents(res.data);
    } catch (err) {
      console.error("Failed to fetch students:", err);
      setError("Unable to fetch students. Showing sample data.");
    } finally {
      setLoading(false);
    }
  };

  fetchStudents();
}, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    router.push("/signin");
  };

  const chartData = selectedStudent
    ? {
        labels: ["Quiz 1", "Quiz 2", "Quiz 3", "Quiz 4", "Quiz 5"],
        datasets: [
          {
            label: "Score",
            data: Array(5).fill(selectedStudent.averageScore),
            backgroundColor: "rgba(14,165,233,0.7)",
            borderRadius: 6,
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      datalabels: {
        anchor: "end" as const,
        align: "end" as const,
        color: "#000",
        font: { weight: "bold" as const, size: 12 },
        formatter: (value: number) => value,
      },
    },
    scales: {
      y: { max: 100, min: 0, ticks: { stepSize: 10 }, grid: { color: "rgba(181, 20, 20, 0.2)" } },
      x: { grid: { display: false } },
    },
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-600 via-teal-700 to-cyan-800 text-white">
      <Sidebar onCollapse={(collapsed) => setSidebarOpen(!collapsed)} onLogout={handleLogout} />

      <main className={`flex-1 p-6 transition-all duration-300 ${sidebarOpen ? "ml-60" : "ml-20"} md:ml-0`}>
        <h1 className="text-3xl font-bold mb-6">Students</h1>

        {loading && <p className="text-gray-200 mb-4">Loading students...</p>}
        {error && <p className="text-red-400 mb-4">{error}</p>}

        {/* Student list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {students.map((student) => (
            <div
              key={student.id}
              className="bg-white/10 p-4 rounded-2xl shadow hover:scale-105 hover:bg-white/20 transition cursor-pointer"
              onClick={() => setSelectedStudent(student)}
            >
              <h3 className="font-semibold text-lg">{student.name}</h3>
              <p className="text-gray-200 text-sm">{student.email}</p>
              <p className="text-gray-200 text-sm">Age: {student.age}</p>
              <p className="text-gray-200 text-sm">
                Average Score: {student.averageScore.toFixed(1)}%
              </p>
            </div>
          ))}
        </div>

        {selectedStudent && (
          <div className="bg-white/10 p-6 rounded-2xl shadow transition">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">{selectedStudent.name}'s Performance</h2>
              <button
                className="bg-red-500 px-3 py-1 rounded-xl hover:bg-red-600 transition"
                onClick={() => setSelectedStudent(null)}
              >
                Close
              </button>
            </div>
            <div className="h-64">{chartData && <Bar data={chartData} options={chartOptions} />}</div>
          </div>
        )}
      </main>
    </div>
  );
}
