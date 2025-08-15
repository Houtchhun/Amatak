"use client"
import React from "react"
import { useAuth } from "@/lib/AuthContext"

export default function AmatakAdminPage() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-6 text-green-700">Welcome to Admin Page</h1>
        {user && (
          <div className="mb-6 flex flex-col items-center">
            <img
              src={user.email === "khikhetun@gmail.com" ? "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" : "/default-avatar.png"}
              alt="Admin Avatar"
              className="w-20 h-20 rounded-full border mb-2"
            />
            <div className="font-semibold text-lg">{user.email}</div>
            <div className="text-sm text-gray-500">Role: {user.role}</div>
          </div>
        )}
        <a
          href="/"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Go to Home Page
        </a>
      </div>
    </div>
  )
}
