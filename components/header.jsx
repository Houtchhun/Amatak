"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/AuthContext"
import { Search, ShoppingCart, User, LogOut, Menu, X, LayoutDashboard } from "lucide-react"

export default function Header({ searchQuery, setSearchQuery }) {
  const { isAuthenticated, logout, user } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery && searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/categories", label: "Categories" },
    { href: "/about", label: "About" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="text-3xl font-bold text-blue-600">
                Amatak
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex lg:items-center lg:justify-center lg:space-x-8">
              {navLinks.map((link) => (
                (link.adminOnly && user?.role !== "admin") ? null : (
                  <Link key={link.href} href={link.href} className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                    {link.label}
                  </Link>
                )
              ))}
            </nav>

            {/* Right-side Actions */}
            <div className="flex items-center justify-end space-x-4">
              <div className="hidden md:block">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="search"
                    placeholder="Search..."
                    value={searchQuery || ''}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-full border-2 border-gray-200 bg-gray-100 py-2 pl-4 pr-10 text-sm focus:border-blue-500 focus:ring-0"
                  />
                  <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-blue-600">
                    <Search size={20} />
                  </button>
                </form>
              </div>

              {isAuthenticated ? (
                <>
                  <Link href="/account/profile" className="hidden md:flex items-center gap-2 rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-100">
                    <User size={22} />
                  </Link>
                  <button onClick={handleLogout} className="hidden md:flex items-center gap-2 rounded-lg px-3 py-2 text-red-600 hover:bg-red-50">
                    <LogOut size={22} />
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/signin" className="hidden md:block rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200">
                    Login
                  </Link>
                  <Link href="/auth/register" className="hidden md:block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    Register
                  </Link>
                </>
              )}

              <div className="flow-root">
                {user?.role === "admin" ? (
                  <Link href="/dashboard" className="group -m-2 flex items-center p-2">
                    <LayoutDashboard size={24} className="flex-shrink-0 text-gray-600 group-hover:text-blue-600" />
                  </Link>
                ) : (
                  <Link href="/cart" className="group -m-2 flex items-center p-2">
                    <ShoppingCart size={24} className="flex-shrink-0 text-gray-600 group-hover:text-blue-600" />
                  </Link>
                )}
              </div>
              
              <div className="lg:hidden">
                  <button onClick={() => setIsMobileMenuOpen(true)} className="rounded-lg p-2 text-gray-600 hover:bg-gray-100">
                      <Menu size={24} />
                  </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white lg:hidden">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Amatak
            </Link>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
              <X size={24} />
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <nav className="flex flex-col items-center justify-center flex-1 space-y-8">
            {navLinks.map((link) => (
              (link.adminOnly && user?.role !== "admin") ? null : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-2xl font-medium text-gray-800 hover:text-blue-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              )
            ))}
          </nav>

          {/* Mobile Auth Buttons */}
          <div className="p-4 border-t">
            {isAuthenticated ? (
                <div className="flex flex-col space-y-4">
                    <Link href="/account/profile" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center rounded-lg bg-gray-100 px-4 py-3 text-lg font-medium text-gray-800 hover:bg-gray-200">
                        My Account
                    </Link>
                    <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="w-full text-center rounded-lg bg-red-100 px-4 py-3 text-lg font-medium text-red-600 hover:bg-red-200">
                        Logout
                    </button>
                </div>
            ) : (
                <div className="flex flex-col space-y-4">
                    <Link href="/auth/signin" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center rounded-lg bg-gray-100 px-4 py-3 text-lg font-medium text-gray-800 hover:bg-gray-200">
                        Login
                    </Link>
                    <Link href="/auth/signin" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center rounded-lg bg-blue-600 px-4 py-3 text-lg font-medium text-white hover:bg-blue-700">
                        Register
                    </Link>
                </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
