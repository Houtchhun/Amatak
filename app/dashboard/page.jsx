"use client"
  
   import React, { useEffect, useState } from "react";
   import { useRouter } from "next/navigation";
   import { useAuth } from "@/lib/AuthContext";
   import Header from "@/components/header";
   import Footer from "@/components/footer";
   import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";
   import UserManagementTable from "@/components/user-management-table";
  
   // Order status options
   const ORDER_STATUSES = ["Pending", "Processing", "Shipping", "Arrived", "Completed", "Cancelled"];

   function getStatusIndex(status) {
     return ORDER_STATUSES.indexOf(status);
   }

   export default function DashboardPage() {
     const router = useRouter();
     const { isAuthenticated, user, isLoading: authLoading } = useAuth();
     const [isAdmin, setIsAdmin] = useState(false);
     const [isLoading, setIsLoading] = useState(true);
     const [searchQuery, setSearchQuery] = useState("");
     const [orders, setOrders] = useState([]);
     const [selectedOrder, setSelectedOrder] = useState(null);
  
     // State for dashboard metrics
     const [totalUsers, setTotalUsers] = useState(0);
     const [totalProducts, setTotalProducts] = useState(0);
     const [totalOrders, setTotalOrders] = useState(0);
     const [totalRevenue, setTotalRevenue] = useState(0);
  
     useEffect(() => {
       if (authLoading) {
         // Still loading authentication state, do nothing yet
         return;
       }

       if (!isAuthenticated) {
         router.push("/auth/signin");
         return;
       }

       if (user?.role === "admin") {
         setIsAdmin(true);

         // If they are an admin, fetch all the data needed for the dashboard
         const allProducts = JSON.parse(localStorage.getItem("adminProducts") || "[]");
         const allOrders = JSON.parse(localStorage.getItem("orders") || "[]");

         // Calculate the totals
         const allUsers = JSON.parse(localStorage.getItem("users") || "[]"); // Still need this for totalUsers count
         setTotalUsers(allUsers.length);
         setTotalProducts(allProducts.length);
         setTotalOrders(allOrders.length);

         const revenue = allOrders.reduce((sum, order) => sum + (order.total || 0), 0);
         setTotalRevenue(revenue);
         setOrders(allOrders);

       } else {
         // If the user is not an admin, redirect them to the homepage
         router.push("/");
       }
       setIsLoading(false);
     }, [authLoading, isAuthenticated, user, router]);

     // Show a loading message while we verify the user's role
     if (isLoading || authLoading) {
       return (
         <div className="min-h-screen flex items-center justify-center bg-gray-50">
           <span className="text-gray-500 text-lg">Verifying access...</span>
         </div>
       );
     }
  
     // Don't render anything if the user is not an admin (while redirecting)
     if (!isAdmin) {
       return null;
     }
  
     // Handler to update order status (prevent regression)
     const handleStatusChange = (orderId, newStatus) => {
      setOrders(prevOrders => {
        const updatedOrders = prevOrders.map(order => {
          if ((order.id || order.orderNumber) === orderId) {
            // Prevent status regression (can't move back to previous status except Cancelled)
            const currentIdx = getStatusIndex(order.status || "Pending");
            const newIdx = getStatusIndex(newStatus);
            if (newStatus === "Cancelled" || newIdx >= currentIdx) {
              return { ...order, status: newStatus };
            } else {
              alert("Cannot move order status backward.");
              return order;
            }
          }
          return order;
        });
        localStorage.setItem("orders", JSON.stringify(updatedOrders));
        return updatedOrders;
      });
    };
  
    // Handler to view order details
    const handleViewOrder = (order) => {
      setSelectedOrder(order);
    };
  
    // Handler to close order detail modal
    const handleCloseOrderDetail = () => {
      setSelectedOrder(null);
    };
  
     // Render the dashboard for the admin
     return (
       <div className="min-h-screen bg-gray-100 flex flex-col">
         <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
         <main className="container mx-auto px-4 py-10 flex-1">
           <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>
  
           {/* Metrics Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
             <DashboardCard
               icon={<Users size={32} className="text-blue-500" />}
               title="Total Users"
               value={totalUsers}
               color="blue"
             />
             <DashboardCard
               icon={<Package size={32} className="text-green-500" />}
               title="Total Products"
               value={totalProducts}
               color="green"
             />
             <DashboardCard
               icon={<ShoppingCart size={32} className="text-orange-500" />}
               title="Total Orders"
               value={totalOrders}
               color="orange"
             />
             <DashboardCard
               icon={<DollarSign size={32} className="text-purple-500" />}
                title="Total Revenue"
                value={`$${totalRevenue.toFixed(2)}`}
                color="purple"
              />
            </div>
   
            <div className="bg-white rounded-2xl shadow p-8 text-center mb-12">
             <h2 className="text-xl font-bold text-gray-700">More Analytics Coming Soon</h2>
             <p className="text-gray-500 mt-2">This area will feature charts and recent activity.</p>
           </div>

           {/* Order Management Table */}
           <div className="bg-white rounded-2xl shadow p-8 mb-12">
             <h2 className="text-xl font-bold text-gray-700 mb-6">Order Management</h2>
             <OrderManagementTable
               orders={orders}
               onStatusChange={handleStatusChange}
               onViewOrder={handleViewOrder}
             />
           </div>

           {/* Order Detail Modal */}
           {selectedOrder && (
             <OrderDetailModal order={selectedOrder} onClose={handleCloseOrderDetail} />
           )}

           {/* User Management Table */}
           <UserManagementTable />
          </main>
          <Footer />
        </div>
      );
    }
   
    // A reusable card component to keep the dashboard clean
    function DashboardCard({ icon, title, value, color }) {
      const colors = {
        blue: "bg-blue-100",
        green: "bg-green-100",
        orange: "bg-orange-100",
        purple: "bg-purple-100",
      };
   
      return (
        <div className={`bg-white rounded-2xl shadow p-6 flex items-center space-x-6`}>
          <div className={`p-4 rounded-full ${colors[color]}`}>
            {icon}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-600">{title}</h2>
            <div className="text-3xl font-bold text-gray-800">{value}</div>
          </div>
        </div>
      );
    }
  
    // Order Management Table Component
    function OrderManagementTable({ orders, onStatusChange, onViewOrder }) {
      if (!orders || orders.length === 0) {
        return <div className="text-gray-500">No orders found.</div>;
      }
      return (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map(order => (
                <tr key={order.id || order.orderNumber}>
                  <td className="px-4 py-2 font-mono text-sm">{order.id || order.orderNumber}</td>
                  <td className="px-4 py-2">{order.customerName || order.name || "-"}</td>
                  <td className="px-4 py-2">{order.email || "-"}</td>
                  <td className="px-4 py-2">${order.total?.toFixed(2) || "-"}</td>
                  <td className="px-4 py-2">
                    <select
                      className="border rounded px-2 py-1"
                      value={order.status || "Pending"}
                      onChange={e => onStatusChange(order.id || order.orderNumber, e.target.value)}
                    >
                      {ORDER_STATUSES.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2 text-xs">{order.date ? new Date(order.date).toLocaleString() : "-"}</td>
                  <td className="px-4 py-2">
                    <button
                      className="text-blue-600 underline hover:text-blue-800"
                      onClick={() => onViewOrder(order)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  
    // Order Detail Modal Component
    function OrderDetailModal({ order, onClose }) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl w-full relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={onClose}
            >
              ×
            </button>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Order Details</h3>
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="mb-2"><span className="font-semibold">Order ID:</span> {order.id || order.orderNumber}</div>
                <div className="mb-2"><span className="font-semibold">Status:</span> {order.status || "Pending"}</div>
                <div className="mb-2"><span className="font-semibold">Date:</span> {order.date ? new Date(order.date).toLocaleString() : "-"}</div>
                <div className="mb-2"><span className="font-semibold">Payment:</span> {order.paymentMethod || "-"}</div>
                <div className="mb-2"><span className="font-semibold">Total:</span> ${order.total?.toFixed(2) || "-"}</div>
              </div>
              <div>
                <div className="mb-2"><span className="font-semibold">Customer:</span> {order.customerName || order.name || "-"}</div>
                <div className="mb-2"><span className="font-semibold">Email:</span> {order.email || "-"}</div>
                <div className="mb-2"><span className="font-semibold">Phone:</span> {order.phone || "-"}</div>
                <div className="mb-2"><span className="font-semibold">Address:</span> {typeof order.billingAddress === 'object' ? `${order.billingAddress.address || ''}, ${order.billingAddress.city || ''}, ${order.billingAddress.state || ''}, ${order.billingAddress.zipCode || ''}, ${order.billingAddress.country || ''}` : order.billingAddress || "-"}</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Items:</h4>
              <ul className="list-disc pl-6">
                {order.cartItems && order.cartItems.length > 0 ? (
                  order.cartItems.map((item, idx) => (
                    <li key={idx} className="mb-1">
                      <span className="font-semibold">{item.name}</span> x{item.quantity} <span className="text-gray-500">(${item.price?.toFixed(2)} each)</span>
                      {item.color && <span className="ml-2 text-xs text-gray-400">Color: {item.color}</span>}
                      {item.size && <span className="ml-2 text-xs text-gray-400">Size: {item.size}</span>}
                    </li>
                  ))
                ) : (
                  <li>No items found.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      );
    }

