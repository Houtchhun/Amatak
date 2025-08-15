"use client"

import React, { useState } from "react"

export default function AdmitPage() {
  const [email, setEmail] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Product add form state
  const [productName, setProductName] = useState("")
  const [productImage, setProductImage] = useState("")
  const [productQuantity, setProductQuantity] = useState(1)
  const [productPrice, setProductPrice] = useState("")
  const [addSuccess, setAddSuccess] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    if (email.trim().toLowerCase() === "khikhe@gmail.com") {
      setIsAdmin(true)
      if (typeof window !== "undefined") {
        localStorage.setItem("isAmatakAdmin", "true")
      }
    } else {
      setIsAdmin(false)
      if (typeof window !== "undefined") {
        localStorage.removeItem("isAmatakAdmin")
      }
    }
  }

  const handleLogout = () => {
    setIsAdmin(false)
    setEmail("")
    setSubmitted(false)
    if (typeof window !== "undefined") {
      localStorage.removeItem("isAmatakAdmin")
    }
  }

  // Add product to shop product list (adminProducts in localStorage)
  const handleAddProduct = (e) => {
    e.preventDefault()
    if (!productName || !productImage || !productPrice || productQuantity < 1) {
      alert("Please fill all product fields.")
      return
    }
    const newProduct = {
      id: Date.now().toString(),
      name: productName,
      image: productImage,
      price: Number(productPrice),
      quantity: Number(productQuantity),
      brand: "Other",
      category: "Admin",
      subcategory: "",
      description: "",
      rating: 5,
      reviewCount: 0,
      sizes: ["M"],
      inStock: true,
    }
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("adminProducts")
      const arr = stored ? JSON.parse(stored) : []
      arr.push(newProduct)
      localStorage.setItem("adminProducts", JSON.stringify(arr))
    }
    setProductName("")
    setProductImage("")
    setProductQuantity(1)
    setProductPrice("")
    setAddSuccess(true)
    setTimeout(() => setAddSuccess(false), 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
        {!isAdmin ? (
          <>
            <h1 className="text-2xl font-bold mb-6 text-blue-700">Admin Login</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Enter admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Login
              </button>
            </form>
            {submitted && email.trim().toLowerCase() !== "khikhe@gmail.com" && (
              <div className="text-red-600 mt-4">Access denied. Only the admin can log in.</div>
            )}
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4 text-green-700">Welcome, Admin!</h1>
            <p className="mb-8 text-gray-700">Add a product to your shop stock:</p>
            <form onSubmit={handleAddProduct} className="space-y-4 mb-6 text-left">
              <label className="block font-medium mb-1">Product Name</label>
              <input
                type="text"
                value={productName}
                onChange={e => setProductName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Product name"
                required
              />
              <label className="block font-medium mb-1">Product Image URL</label>
              <input
                type="text"
                value={productImage}
                onChange={e => setProductImage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Image URL"
                required
              />
              <label className="block font-medium mb-1">Quantity</label>
              <input
                type="number"
                min={1}
                value={productQuantity}
                onChange={e => setProductQuantity(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
              <label className="block font-medium mb-1">Price</label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={productPrice}
                onChange={e => setProductPrice(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Add Product
              </button>
              {addSuccess && (
                <div className="text-green-600 mt-2 text-center">Product added to shop!</div>
              )}
            </form>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 underline hover:text-gray-700"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  )
}
