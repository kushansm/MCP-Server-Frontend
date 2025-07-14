"use client";
import { useState } from "react";

export default function Home() {
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [questionStatus, setQuestionStatus] = useState("");

  const handleUpload = async () => {
    if (!resumeFile) {
      setUploadStatus("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);

    try {
      const res = await fetch("http://localhost:3000/resume/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setUploadStatus(res.ok ? data.message || "Uploaded!" : data.error || "Failed.");
    } catch (err) {
      setUploadStatus("Server error during upload.");
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) {
      setQuestionStatus("Please enter a question.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/resume/chat?q=${encodeURIComponent(question)}`);
      const data = await res.json();
      if (res.ok) {
        setAnswer(data.answer || "No answer returned.");
        setQuestionStatus("Answer retrieved ");
      } else {
        setAnswer("");
        setQuestionStatus(data.error || "Failed to get answer.");
      }
    } catch {
      setAnswer("");
      setQuestionStatus("Server error while asking.");
    }
  };

  return (
      <div className="min-h-screen bg-gray-50 px-6 py-10 sm:py-16 flex flex-col items-center">
        <div className="bg-white shadow-2xl rounded-2xl max-w-2xl w-full p-8 sm:p-10 space-y-10 border border-gray-200">
          <h1 className="text-3xl font-bold text-center text-gray-800">📄 MCP Playground</h1>

          {/* Upload Resume */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-center text-blue-700">Upload Resume</h2>
            <input
                type="file"
                className="border border-gray-300 rounded px-4 py-2 w-full"
                onChange={(e) => setResumeFile(e.target.files[0])}
            />
            <div className="flex justify-center">
              <button
                  onClick={handleUpload}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded shadow"
              >
                Upload
              </button>
            </div>
            {uploadStatus && (
                <p className="text-center text-sm text-green-600">{uploadStatus}</p>
            )}
          </section>

          {/* Ask Question */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-center text-purple-700">Ask a Resume Question</h2>
            <input
                type="text"
                placeholder="e.g., What was my last job?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAsk()}
                className="border border-gray-300 rounded px-4 py-2 w-full"
            />
            <div className="flex justify-center">
              <button
                  onClick={handleAsk}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 rounded shadow"
              >
                Ask
              </button>
            </div>
            {questionStatus && (
                <p className="text-center text-sm text-blue-700">{questionStatus}</p>
            )}

            {/* Answer Display */}
            <h2 className="text-xl font-semibold text-center text-gray-700">Answer</h2>
            <div className="min-h-[128px] bg-gray-100 border border-gray-300 rounded p-4 text-gray-800 whitespace-pre-line">
              {answer}
            </div>
          </section>
        </div>
      </div>
  );
}
