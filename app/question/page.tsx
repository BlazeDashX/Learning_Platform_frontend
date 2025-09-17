"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

type Option = string;

interface Question {
  text: string;
  options: Option[];
  correctAnswer: string;
}

interface Section {
  name: string;
  questions: Question[];
}

export default function CreateQuestionPaper() {
  const [sections, setSections] = useState<Section[]>([
    { name: "Basic", questions: [] },
    { name: "Moderate", questions: [] },
    { name: "Hard", questions: [] },
  ]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true); // sidebar state
  const router = useRouter();

  const addQuestion = (sectionIdx: number) => {
    const newSections = [...sections];
    newSections[sectionIdx].questions.push({
      text: "",
      options: ["", "", "", ""],
      correctAnswer: "A",
    });
    setSections(newSections);
  };

  const updateQuestionText = (sectionIdx: number, qIdx: number, text: string) => {
    const newSections = [...sections];
    newSections[sectionIdx].questions[qIdx].text = text;
    setSections(newSections);
  };

  const updateOption = (
    sectionIdx: number,
    qIdx: number,
    optionIdx: number,
    value: string
  ) => {
    const newSections = [...sections];
    newSections[sectionIdx].questions[qIdx].options[optionIdx] = value;
    setSections(newSections);
  };

  const updateCorrectAnswer = (sectionIdx: number, qIdx: number, value: string) => {
    const newSections = [...sections];
    newSections[sectionIdx].questions[qIdx].correctAnswer = value;
    setSections(newSections);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const payload = sections.flatMap((sec) =>
        sec.questions.map((q) => ({ ...q, section: sec.name }))
      );

      await api.post("/teacher/question-paper", { questions: payload });
      alert("Question paper created successfully!");
      router.push("/dashboard");
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || "Failed to create question paper");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getQuestionNumber = (sectionIdx: number, qIdx: number) =>
    sections
      .slice(0, sectionIdx)
      .reduce((acc, sec) => acc + sec.questions.length, 0) + qIdx + 1;

  const handleLogout = async () => {
    try { await api.post("/auth/logout"); } catch {}
    router.push("/signin");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-600 via-teal-700 to-cyan-800 text-white">
      {/* Sidebar */}
      <Sidebar
        onCollapse={(collapsed) => setSidebarOpen(!collapsed)}
        onLogout={handleLogout}
      />
      <main className={`flex-1 p-6 transition-all duration-300 ${sidebarOpen ? "ml-60" : "ml-20"} md:ml-0`}>
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-xl rounded-2xl p-8 space-y-6">
          <h1 className="text-3xl font-bold text-center mb-6">Create Question Paper</h1>

          {sections.map((section, sIdx) => (
            <div key={section.name} className="space-y-4">
              <h2 className="text-2xl font-semibold">{section.name} Section</h2>
              {section.questions.map((q, qIdx) => {
                const questionNumber = getQuestionNumber(sIdx, qIdx);
                return (
                  <div
                    key={questionNumber}
                    className="p-4 bg-white/20 rounded-xl space-y-2 flex flex-col"
                  >
                    <div className="flex items-start gap-2">
                      <span className="font-bold w-6 text-white text-lg">{questionNumber}.</span>
                      <textarea
                        value={q.text}
                        onChange={(e) => updateQuestionText(sIdx, qIdx, e.target.value)}
                        placeholder={`Enter question here`}
                        className="flex-1 px-4 py-2 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none"
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-2">
                          <span className="font-bold w-4">{String.fromCharCode(65 + optIdx)})</span>
                          <input
                            type="text"
                            placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                            value={opt}
                            onChange={(e) => updateOption(sIdx, qIdx, optIdx, e.target.value)}
                            className="flex-1 px-4 py-2 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none"
                          />
                        </div>
                      ))}
                    </div>

                    <select
                      value={q.correctAnswer}
                      onChange={(e) => updateCorrectAnswer(sIdx, qIdx, e.target.value)}
                      className="px-4 py-2 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none mt-2"
                    >
                      <option value="A">Option A</option>
                      <option value="B">Option B</option>
                      <option value="C">Option C</option>
                      <option value="D">Option D</option>
                    </select>
                  </div>
                );
              })}
              <button
                onClick={() => addQuestion(sIdx)}
                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-xl font-semibold transition"
              >
                Add Question
              </button>
            </div>
          ))}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-xl font-semibold transition disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Question Paper"}
          </button>
        </div>
      </main>
    </div>
  );
}
