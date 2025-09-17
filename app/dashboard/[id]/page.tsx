"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { ClassItem } from "@/lib/data";

export default function ClassPage() {
  const params = useParams();
  const classId = params.id;

  const [cls, setCls] = useState<ClassItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const res = await api.get<ClassItem>(`/teacher/class/${classId}`);
        setCls(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchClass();
  }, [classId]);

  if (loading) return <div className="text-center mt-20">Loading class...</div>;
  if (!cls) return <div className="text-center mt-20">Class not found.</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{cls.title}</h1>
      <p className="mb-6">{cls.description || "No description provided."}</p>
    </div>
  );
}
