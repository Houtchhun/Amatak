 "use client"
     
      import React, { useEffect, useState } from "react"
      import Header from "@/components/header"
      import Footer from "@/components/footer"
      import { useAuth } from "@/lib/AuthContext"
      import Link from "next/link"
     
      export default function OrderManagementPage() {
        const { user } = useAuth() // Get user from AuthContext
        const [isAdmin, setIsAdmin] = useState(false)
        const [orders, setOrders] = useState([])
        const [searchQuery, setSearchQuery] = useState("")
      
       useEffect(() => {
         if (typeof window !== "undefined") {
           // Determine admin status based on user role from AuthContext
           const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
           const currentUser = allUsers.find(u => u.phone === user?.email);
           const isAdminUser = currentUser?.role === "admin";
           setIsAdmin(isAdminUser)
    
           // If the user is not an admin, redirect them to their own orders page
           if (!isAdminUser) {
             window.location.href = "/orders"
             return // Stop further execution for non-admins
           }
    
           // This code will only run for admins
           const stored = localStorage.getItem("orders")
           setOrders(stored ? JSON.parse(stored) : [])
         }
       }, [user])
    
       // Handler to remove an order
       const handleRemoveOrder = (orderNumber) => {
         if (confirm("Are you sure you want to delete this order? This will also restock the products.")) {
           const orderToRemove = orders.find((o) => o.orderNumber === orderNumber);
           if (orderToRemove && orderToRemove.items) {
             const adminProducts = JSON.parse(localStorage.getItem("adminProducts") || "[]");
             const updatedAdminProducts = adminProducts.map((prod) => {
               const orderItem = orderToRemove.items.find((item) => item.id === prod.id);
               if (orderItem && typeof prod.quantity === "number") {
                 return { ...prod, quantity: prod.quantity + orderItem.quantity };
               }
               return prod;
             });
             localStorage.setItem("adminProducts", JSON.stringify(updatedAdminProducts));
           }

           const updated = orders.filter((o) => o.orderNumber !== orderNumber);
           setOrders(updated);
           localStorage.setItem("orders", JSON.stringify(updated));
         }
       };
    
     // Handler to mark an order as shipped
       const handleMarkShipped = (orderNumber) => {
         const updated = orders.map((o) =>
           o.orderNumber === orderNumber ? { ...o, status: "Shipped" } : o
         )
         setOrders(updated)
         localStorage.setItem("orders", JSON.stringify(updated))
       }

       const orderStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Refunded"];
       const paymentStatuses = ["Pending", "Paid", "Refunded", "Failed"];

       const handleStatusChange = (orderNumber, newStatus) => {
         const updated = orders.map((o) =>
           o.orderNumber === orderNumber ? { ...o, status: newStatus } : o
         );
         setOrders(updated);
         localStorage.setItem("orders", JSON.stringify(updated));
       };

       const handlePaymentStatusChange = (orderNumber, newStatus) => {
         const updated = orders.map((o) =>
           o.orderNumber === orderNumber ? { ...o, paymentStatus: newStatus } : o
         );
         setOrders(updated);
         localStorage.setItem("orders", JSON.stringify(updated));
       };
    
       // Filter orders based on search query
       const filteredOrders = orders.filter((order) =>
         order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
         (order.shippingInfo &&
           `${order.shippingInfo.firstName} ${order.shippingInfo.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()))
       )
    
       // The component only renders the admin dashboard if isAdmin is true
       return (
         <div className="min-h-screen bg-gray-50 flex flex-col">
           <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
           <main className="container mx-auto px-4 py-8 flex-1">
             <h1 className="text-3xl font-bold mb-8">Order Management</h1>
             {isAdmin && (
               <div className="bg-white rounded-xl shadow p-8">
                 <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                   <input
                     type="text"
                     placeholder="Search by order number or customer name"
                     value={searchQuery}
                     onChange={e => setSearchQuery(e.target.value)}
                     className="border px-4 py-2 rounded-lg w-full md:w-1/3"
                   />
                   <span className="text-gray-600">{filteredOrders.length} orders</span>
                 </div>
                 <div className="overflow-x-auto">
                   <table className="w-full border">
                     <thead>
                       <tr className="bg-gray-100">
                         <th className="py-2 px-2">Order #</th>
                         <th className="py-2 px-2">Date</th>
                         <th className="py-2 px-2">Customer</th>
                         <th className="py-2 px-2">Total</th>
                         <th className="py-2 px-2">Status</th>
                         <th className="py-2 px-2">Payment Status</th>
                         <th className="py-2 px-2">Actions</th>
                       </tr>
                     </thead>
                     <tbody>
                       {filteredOrders.length === 0 ? (
                         <tr>
                           <td colSpan={6} className="py-4 text-gray-500 text-center">No orders found.</td>
                         </tr>
                       ) : (
                         filteredOrders.map((order) => (
                           <tr key={order.orderNumber}>
                             <td className="py-2 px-2 font-mono">
                               <Link href={`/order-management/${order.orderNumber}`} className="text-blue-600 hover:underline">
                                 {order.orderNumber}
                               </Link>
                             </td>
                             <td className="py-2 px-2">{order.date ? new Date(order.date).toLocaleDateString() : ""}</td>
                             <td className="py-2 px-2">
                               {order.shippingInfo
                                 ? `${order.shippingInfo.firstName} ${order.shippingInfo.lastName}`
                                                             : "—"}
                             </td>
                             <td className="py-2 px-2">${order.total?.toFixed(2)}</td>
                            <td className="py-2 px-2">
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                order.status === "Shipped"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}>
                                {order.status || "Pending"}
                              </span>
                            </td>
                            <td className="py-2 px-2">
                              <select
                                value={order.paymentStatus || "Pending"}
                                onChange={(e) => handlePaymentStatusChange(order.orderNumber, e.target.value)}
                                className={`px-2 py-1 rounded text-xs font-semibold border ${
                                  order.paymentStatus === "Paid"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {paymentStatuses.map((status) => (
                                  <option key={status} value={status}>
                                    {status}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="py-2 px-2 flex gap-2 justify-center">
                              <button
                                onClick={() => handleRemoveOrder(order.orderNumber)}
                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 font-semibold"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </main>
          <Footer />
        </div>
      )
    }