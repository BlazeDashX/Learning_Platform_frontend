import api from "./api";

export type TeacherProfile = {
  id: number;
  name: string;
  email: string;
  profilePicture?: string;
  bio?: string;
  phone?: string;
  room?: string;
  achievements?: string;
  awards?: string;
  certifications?: string;
  school?: string;
  college?: string;
  university?: string;
  degree?: string;
  publications?: string;
};

export type ClassItem = {
  id: number;
  title: string;
  description?: string;
  students: StudentItem[];
  avgScore: number;
};

export type StudentItem = {
  id: number;
  name: string;
  email: string;
  age: number;
  averageScore: number;
  classId: number;
};

export async function fetchData() {
  const res = await api.get<{
    teacher: TeacherProfile;
    classes: ClassItem[];
    totalStudents: number;
  }>("/teacher/dashboard");

  const teacher = res.data.teacher;
  const classes = Array.isArray(res.data.classes) ? res.data.classes : [];

  return { teacher, classes };
}
