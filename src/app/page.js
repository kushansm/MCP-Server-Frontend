"use client";
import { useState } from "react";

export default function Home() {
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [questionStatus, setQuestionStatus] = useState("");

  // Handle resume upload to backend
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

      if (res.ok) {
        setUploadStatus(data.message || "Resume uploaded successfully.");
      } else {
        setUploadStatus(data.error || "Failed to upload resume.");
      }
    } catch (err) {
      setUploadStatus("Upload failed. Check backend or server.");
    }
  };

  // Handle asking a question from the backend
  const handleAsk = async () => {
    if (!question.trim()) {
      setQuestionStatus("Please enter a question.");
      return;
    }

    try {
      const res = await fetch(
          `http://localhost:3000/resume/chat?q=${encodeURIComponent(question)}`
      );
      const data = await res.json();

      if (res.ok) {
        setAnswer(data.answer || "No answer returned.");
        setQuestionStatus("Answer retrieved successfully.");
      } else {
        setAnswer("");
        setQuestionStatus(data.error || "Failed to get answer.");
      }
    } catch (err) {
      setAnswer("");
      setQuestionStatus("Failed to connect to backend.");
    }
  };

  return (
      <div className="min-h-screen p-10 space-y-12 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-center">📄 MCP Playground</h1>

        {/* Upload Resume */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-center">Upload Resume</h2>
          <input
              type="file"
              className="border rounded p-2 w-full"
              onChange={(e) => setResumeFile(e.target.files[0])}
          />
          <div className="flex justify-center">
            <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleUpload}
            >
              Upload
            </button>
          </div>
          {uploadStatus && (
              <p className="text-sm text-green-700 text-center">{uploadStatus}</p>
          )}
        </section>

        {/* Ask Question */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-center">
            Ask a Resume Question
          </h2>
          <input
              type="text"
              placeholder="e.g., What was my last job?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="border rounded p-2 w-full"
          />
          <div className="flex justify-center">
            <button
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                onClick={handleAsk}
            >
              Ask
            </button>
          </div>
          {questionStatus && (
              <p className="text-sm text-blue-700 text-center">{questionStatus}</p>
          )}

          {/* Answer Display */}
          <h2 className="text-xl font-semibold text-center">Answer</h2>
          <div className="min-h-[128px] bg-gray-100 border rounded p-4 text-gray-800">
            {answer}
          </div>
        </section>
      </div>
  );
}
