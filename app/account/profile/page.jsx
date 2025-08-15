"use client"

import React, { useState, useEffect } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { useAuth } from "@/lib/AuthContext"
import { useRouter } from "next/navigation"
import { User, LogOut, ShoppingCart, Heart } from "lucide-react";

// Get user from localStorage or fallback to empty data
const getUserFromAuth = (loggedInUserPhone) => {
  if (typeof window !== "undefined" && loggedInUserPhone) {
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const currentUser = allUsers.find(user => user.phone === loggedInUserPhone);
    if (currentUser) {
      return {
        firstName: currentUser.name.split(' ')[0] || '',
        lastName: currentUser.name.split(' ').slice(1).join(' ') || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        address: currentUser.address || '',
        city: currentUser.city || '',
        state: currentUser.state || '',
        zipCode: currentUser.zipCode || '',
        country: currentUser.country || '',
        role: currentUser.role || 'customer',
      };
    }
  }
  return {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  };
}


export default function ProfilePage() {
  const { logout, user } = useAuth(); // Get user from AuthContext
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(getUserFromAuth(user?.email)) // Pass logged-in user's phone
  const [searchQuery, setSearchQuery] = useState("")
  const [theme, setTheme] = useState(
    typeof window !== "undefined"
      ? (localStorage.getItem("theme") || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"))
      : "light"
  )

  // Apply theme to <html> element
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.remove("light", "dark")
      document.documentElement.classList.add(theme)
      localStorage.setItem("theme", theme)
    }
  }, [theme])

  // Logout handler
  const handleLogout = () => {
    logout();
    router.push("/");
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }


  const handleSave = (e) => {
    e.preventDefault();
    if (typeof window !== "undefined" && user?.email) {
      const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const updatedUsers = allUsers.map((u) => {
        if (u.phone === user.email) {
          return {
            ...u,
            name: `${formData.firstName} ${formData.lastName}`.trim(),
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
          };
        }
        return u;
      });
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      // Also update the loginEmail in case phone number was changed
      localStorage.setItem("loginEmail", formData.phone);
    }
    setIsEditing(false);
    alert("Profile updated successfully!");
  };


  const handleCancel = () => {
    setFormData(getUserFromAuth()) // Reset to last saved data
    setIsEditing(false)
  }

  const [isAdmin, setIsAdmin] = useState(false)
    useEffect(() => {
       // Determine admin status based on user role
        setIsAdmin(formData.role === "admin")
        console.log("isAdmin useEffect - formData.role:", formData.role, "isAdmin:", formData.role === "admin")
    }, [formData.role])

  // Update formData when user from AuthContext changes
  useEffect(() => {
    setFormData(getUserFromAuth(user?.email));
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-800">My Account</span>
            <span>/</span>
            <span className="text-gray-800">Profile</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">My Account</h2>
              <nav>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/account/profile"
                      className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 text-blue-600 font-medium hover:bg-blue-100 transition-colors"
                    >
                      <User size={20} />
                      Profile
                    </Link>

                  </li>
                  {/* Admin-only links */}
                  {isAdmin && (
                    <>
                     <li>
                        <Link
                          href="/order-management"
                          className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                        <ShoppingCart size={20} />
                          Orders
                        </Link>
                      </li>
                    </>
                   )}
                   {!isAdmin && (
                    <>
                      <li>
                        <Link
                          href="/orders"
                          className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                          <ShoppingCart size={20} />
                          My Orders
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/wishlist"
                          className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                          <Heart size={20} />
                          Wishlist
                        </Link>
                      </li>
                    </>
                  )}
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                    >
                      <LogOut size={20} />
                      Logout
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </aside>

          {/* Profile Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Personal Information</h1>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancel}
                      className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>

              <form className="space-y-6">
                {/* User Info Section (like registration) */}
                <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">Account Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
                          !isEditing ? "bg-gray-100 text-gray-600" : "bg-white border-gray-300"
                        }`}
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
                          !isEditing ? "bg-gray-100 text-gray-600" : "bg-white border-gray-300"
                        }`}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
                          !isEditing ? "bg-gray-100 text-gray-600" : "bg-white border-gray-300"
                        }`}
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
                          !isEditing ? "bg-gray-100 text-gray-600" : "bg-white border-gray-300"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4 mt-8">Shipping Address</h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
                          !isEditing ? "bg-gray-100 text-gray-600" : "bg-white border-gray-300"
                        }`}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          readOnly={!isEditing}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
                            !isEditing ? "bg-gray-100 text-gray-600" : "bg-white border-gray-300"
                          }`}
                        />
                      </div>
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          readOnly={!isEditing}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
                            !isEditing ? "bg-gray-100 text-gray-600" : "bg-white border-gray-300"
                          }`}
                        />
                      </div>
                      <div>
                        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          readOnly={!isEditing}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
                            !isEditing ? "bg-gray-100 text-gray-600" : "bg-white border-gray-300"
                          }`}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
                          !isEditing ? "bg-gray-100 text-gray-600" : "bg-white border-gray-300"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
