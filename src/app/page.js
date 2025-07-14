"use client";

export default function Home() {
  return (
      <div className="min-h-screen p-10 space-y-12 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-center">📄 MCP Playground</h1>

        {/* Upload Resume */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-center"> Upload Resume</h2>
          <input type="file" className="border rounded p-2 w-full" />
          <div className="flex justify-center">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Upload
            </button>
          </div>
        </section>

        {/* Ask Question */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-center"> Ask a Resume Question ?</h2>
          <input
              type="text"
              placeholder="e.g., What was my last job?"
              className="border rounded p-2 w-full"
          />
          <div className="flex justify-center">
            <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
              Ask
            </button>
          </div>

        </section>

      </div>
  );
}
