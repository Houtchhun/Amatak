 "use client"
  
   import React, { useEffect, useState } from "react";
   import { useRouter } from "next/navigation";
   import { useAuth } from "@/lib/AuthContext";
   import Header from "@/components/header";
   import Footer from "@/components/footer";
   import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";
   import UserManagementTable from "@/components/user-management-table";
  
   export default function DashboardPage() {
     const router = useRouter();
     const { isAuthenticated, user, isLoading: authLoading } = useAuth();
     const [isAdmin, setIsAdmin] = useState(false);
     const [isLoading, setIsLoading] = useState(true);
     const [searchQuery, setSearchQuery] = useState("");
  
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
   
            <div className="bg-white rounded-2xl shadow p-8 text-center">
             <h2 className="text-xl font-bold text-gray-700">More Analytics Coming Soon</h2>
             <p className="text-gray-500 mt-2">This area will feature charts and recent activity.</p>
           </div>

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