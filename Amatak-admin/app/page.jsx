import React from "react"

export default function AmatakAdminPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-6 text-green-700">Welcome</h1>
        <a
          href="/"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Back to Home
        </a>
      </div>
    </div>
  )
}