"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useAuth } from "@/lib/AuthContext"
import Link from "next/link"

export default function OrderDetailPage() {
  const { orderId } = useParams()
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (authLoading) return // Wait for auth context to load

    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/") // Redirect if not authenticated or not admin
      return
    }

    setIsAdmin(true)

    if (typeof window !== "undefined") {
      const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
      const foundOrder = storedOrders.find((o) => o.orderNumber === orderId)
      setOrder(foundOrder)
      setLoading(false)
    }
  }, [orderId, user, isAuthenticated, authLoading, router])

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="text-gray-500 text-lg">Loading order details...</span>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="container mx-auto px-4 py-8 flex-1 text-center">
          <h1 className="text-3xl font-bold mb-4">Order Not Found</h1>
          <p className="text-gray-600">The order with ID "{orderId}" could not be found.</p>
          <Link href="/order-management" className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Back to Order Management
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl font-bold mb-8">Order Details: #{order.orderNumber}</h1>

        <div className="bg-white rounded-xl shadow p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>Order Date:</strong> {order.date ? new Date(order.date).toLocaleDateString() : "N/A"}</p>
              <p><strong>Total Amount:</strong> ${order.total?.toFixed(2)}</p>
              <p><strong>Status:</strong> <span className={`px-2 py-1 rounded text-xs font-semibold ${
                order.status === "Shipped"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}>{order.status || "Pending"}</span></p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Shipping Information</h3>
              {order.shippingInfo ? (
                <>
                  <p>{order.shippingInfo.firstName} {order.shippingInfo.lastName}</p>
                  <p>{order.shippingInfo.address}</p>
                  <p>{order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.zipCode}</p>
                  <p>{order.shippingInfo.country}</p>
                  <p>Phone: {order.shippingInfo.phone}</p>
                </>
              ) : (
                <p>No shipping information available.</p>
              )}
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Items Ordered</h2>
          <div className="overflow-x-auto">
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-2 text-left">Product</th>
                  <th className="py-2 px-2 text-center">Quantity</th>
                  <th className="py-2 px-2 text-right">Price</th>
                  <th className="py-2 px-2 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-2 px-2">{item.name}</td>
                      <td className="py-2 px-2 text-center">{item.quantity}</td>
                      <td className="py-2 px-2 text-right">${item.price?.toFixed(2)}</td>
                      <td className="py-2 px-2 text-right">${(item.price * item.quantity)?.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-4 text-center text-gray-500">No items in this order.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <Link href="/order-management" className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Back to Order Management
        </Link>
      </main>
      <Footer />
    </div>
  )
}
