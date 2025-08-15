"use client"

import React, { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext"; // Import useAuth

export default function OrderManagementPage() {
    const { user } = useAuth(); // Get user from AuthContext
    const [userOrders, setUserOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined" && user) {
            const allOrders = JSON.parse(localStorage.getItem('orders') || "[]");

            // Filter orders by matching the phone number from the user's auth state
            // The user object from context holds the identifier (phone or email) in the 'email' field.
            const filteredOrders = allOrders.filter(
                (order) => order.userId && order.userId === user.email
            );
            setUserOrders(filteredOrders);
        }
    }, [user]); // Re-run when the user state changes

    const filteredBySearch = userOrders.filter((order) =>
        order.orderNumber && order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <main className="container mx-auto px-4 py-8 flex-1">
                <div className="mb-8">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Link href="/" className="hover:text-blue-600">Home</Link>
                        <span className="text-gray-400">/</span>
                        <Link href="/account/profile" className="hover:text-blue-600">My Account</Link>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-800">My Orders</span>
                    </div>
                </div>
                <h1 className="text-3xl font-bold mb-8">My Order History</h1>
                {user ? (
                    <div className="bg-white rounded-xl shadow p-8">
                        <div className="overflow-x-auto">
                            <table className="w-full border">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="py-2 px-4 text-left">Order</th>
                                        <th className="py-2 px-4 text-left">Date</th>
                                        <th className="py-2 px-4 text-left">Total</th>
                                        <th className="py-2 px-4 text-left">Status</th>
                                        <th className="py-2 px-4 text-left">Items</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBySearch.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="py-16 text-gray-500 text-center">You have not placed any orders yet.</td>
                                        </tr>
                                    ) : (
                                        filteredBySearch.map((order) => (
                                            <tr key={order.orderNumber} className="border-b">
                                                <td className="py-3 px-4 font-mono">{order.orderNumber || 'N/A'}</td>
                                                <td className="py-3 px-4">{new Date(order.date).toLocaleDateString()}</td>
                                                <td className="py-3 px-4">${order.total?.toFixed(2) || '0.00'}</td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                                                        ${order.status === "Shipped"
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-yellow-100 text-yellow-800"}`}>
                                                        {order.status || "Pending"}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">{order.cartItems.reduce((total, item) => total + item.quantity, 0)}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow p-16 text-center">
                        <p className="text-gray-600">Please <Link href="/auth/signin" className="text-blue-600 hover:underline font-semibold">sign in</Link> to view your order history.</p>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}