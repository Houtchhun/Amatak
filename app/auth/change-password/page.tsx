"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"

export default function ChangePasswordPage() {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  })

  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const togglePasswordVisibility = (field: "newPassword" | "confirmPassword") => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.newPassword !== formData.confirmPassword) {
      alert("Passwords do not match!")
      return
    }

    console.log("Password change submitted:", formData)
    // Handle password change logic here
  }

  return (
    <div className="password-container">
      <div className="password-form">
        <h1>Change your password</h1>
        <p>Enter your password below to change your password</p>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="new-password">New password</label>
            <div className="password-box">
              <input
                type={showPassword.newPassword ? "text" : "password"}
                id="new-password"
                name="newPassword"
                placeholder="New password"
                value={formData.newPassword}
                onChange={handleInputChange}
                required
              />
              <button type="button"
                onClick={() => togglePasswordVisibility("newPassword")} className = "absolute inset-y-0 right-0 flex items-center px-3 text-gray-600" >
                {showPassword.newPassword ? "Hide":"Show"}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirm-password">Confirm password</label>
            <div className="password-box">
              <input
                type={showPassword.confirmPassword ? "text" : "password"}
                id="confirm-password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
               <button type="button" onClick={() =>  togglePasswordVisibility("confirmPassword")} className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"> {showPassword.newPassword ? "Hide" : "Show"}</button>
            </div>
          </div>

         
        </form>

        <div className="mt-6 text-center">
          <Link href="/auth/signin" className="text-blue-600 hover:underline">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
