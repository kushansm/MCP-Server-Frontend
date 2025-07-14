"use client";
import { useState } from "react";

export default function Home() {
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [questionStatus, setQuestionStatus] = useState("");
  const [emailStatus, setEmailStatus] = useState("");
  const [emailForm, setEmailForm] = useState({
    recipient: "",
    subject: "",
    body: "",
  });

  const handleUpload = async () => {
    if (!resumeFile) {
      setUploadStatus("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);

    try {
      const res = await fetch("https://mcp-server-backend-production.up.railway.app/resume/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setUploadStatus(data.message || "Uploaded!");
        if (data.extractedEmail && data.extractedEmail !== "No email found in resume") {
          setEmailForm((prev) => ({ ...prev, recipient: data.extractedEmail }));
        }
      } else {
        setUploadStatus(data.error || "Upload failed.");
      }
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
      const res = await fetch(
          `https://mcp-server-backend-production.up.railway.app/resume/chat?q=${encodeURIComponent(question)}`
      );
      const data = await res.json();
      if (res.ok) {
        setAnswer(data.answer || "No answer returned.");
        setQuestionStatus("Answer retrieved.");
      } else {
        setAnswer("");
        setQuestionStatus(data.error || "Failed to get answer.");
      }
    } catch {
      setAnswer("");
      setQuestionStatus("Server error while asking.");
    }
  };

  const handleSendEmail = async () => {
    const { recipient, subject, body } = emailForm;
    if (!recipient || !subject || !body) {
      setEmailStatus("Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch("https://mcp-server-backend-production.up.railway.app/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipient, subject, body }),
      });
      const data = await res.json();
      setEmailStatus(res.ok ? data.message : data.error);
    } catch {
      setEmailStatus("Server error while sending email.");
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

          {/* Ask Resume Question */}
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
            <h2 className="text-xl font-semibold text-center text-gray-700">Answer</h2>
            <div className="min-h-[128px] bg-gray-100 border border-gray-300 rounded p-4 text-gray-800 whitespace-pre-line">
              {answer}
            </div>
          </section>

          {/* Send Email */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-center text-green-700">Send Email</h2>
            <input
                type="email"
                placeholder="Recipient"
                value={emailForm.recipient}
                onChange={(e) => setEmailForm({ ...emailForm, recipient: e.target.value })}
                className="border border-gray-300 rounded px-4 py-2 w-full"
            />
            <input
                type="text"
                placeholder="Subject"
                value={emailForm.subject}
                onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                className="border border-gray-300 rounded px-4 py-2 w-full"
            />
            <textarea
                placeholder="Email body"
                value={emailForm.body}
                onChange={(e) => setEmailForm({ ...emailForm, body: e.target.value })}
                className="border border-gray-300 rounded px-4 py-2 w-full"
                rows={4}
            />
            <div className="flex justify-center">
              <button
                  onClick={handleSendEmail}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded shadow"
              >
                Send Email
              </button>
            </div>
            {emailStatus && (
                <p className="text-center text-sm text-green-700">{emailStatus}</p>
            )}
          </section>
        </div>
      </div>
  );
}
