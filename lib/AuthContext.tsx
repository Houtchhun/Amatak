"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  user: { email: string; role: string } | null
  login: (email: string, role: string) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<{ email: string; role: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAuth = localStorage.getItem("isAuthenticated") === "true"
      const storedEmail = localStorage.getItem("loginEmail")
      const storedRole = localStorage.getItem("loginRole")
      
      if (storedAuth && storedEmail && storedRole) {
        setIsAuthenticated(true)
        setUser({ email: storedEmail, role: storedRole })
      }
      setIsLoading(false)
    }
  }, [])

  const login = (email: string, role: string) => {
    setIsAuthenticated(true)
    setUser({ email, role })
    if (typeof window !== "undefined") {
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("loginEmail", email)
      localStorage.setItem("loginRole", role)
    }
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("isAuthenticated")
      localStorage.removeItem("loginEmail")
      localStorage.removeItem("loginRole")
      localStorage.removeItem("isAmatakAdmin")
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
