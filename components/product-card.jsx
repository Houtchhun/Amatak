"use client"

import Image from "next/image"
import { Star, ShoppingCart, Heart } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { addToCart } from "@/lib/cart"
import { useAuth } from "@/lib/AuthContext"
import AddToCartModal from "./add-to-cart-modal"

export default function ProductCard({
  id,
  name,
  title, // Add title to props
  category,
  price,
  originalPrice,
  rating,
  reviewCount,
  image,
  badge,
  viewMode = "grid",
  sizes = ["M"],
  colors = [],
  inStock = true,
}) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  const productName = name || title; // Use name or title

  // Check if item is wishlisted on mount
  useEffect(() => {
    if (typeof window !== "undefined" && isAuthenticated) {
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
      setIsWishlisted(wishlist.includes(id))
    }
  }, [id, isAuthenticated])

  // Quick Add to Cart handler (for grid view)
  const handleQuickAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isAuthenticated) {
      setShowAuthPrompt(true)
      return
    }

    // For simple products, add directly
    if ((!sizes || sizes.length <= 1) && (!colors || colors.length <= 1)) {
      try {
        addToCart({
          id,
          name: productName,
          price,
          originalPrice,
          image,
          quantity: 1,
          category,
          color: colors?.[0]?.name || "default",
          size: sizes?.[0] || "default",
          inStock
        })
        router.push("/cart")
      } catch (err) {
        console.error("Failed to add to cart:", err)
      }
    } else {
      // For complex products, show modal
      setShowModal(true)
    }
  }

  // Wishlist handler
  const handleWishlistToggle = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isAuthenticated) {
      setShowAuthPrompt(true)
      return
    }

    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
    if (isWishlisted) {
      const updated = wishlist.filter(itemId => itemId !== id)
      localStorage.setItem("wishlist", JSON.stringify(updated))
    } else {
      wishlist.push(id)
      localStorage.setItem("wishlist", JSON.stringify(wishlist))
    }
    setIsWishlisted(!isWishlisted)
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />)
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" size={16} className="fill-yellow-400 text-yellow-400 opacity-50" />)
    }

    const remainingStars = 5 - Math.ceil(rating)
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={16} className="text-gray-300" />)
    }

    return stars
  }

  if (viewMode === "list") {
    return (
      <>
        <div className="overflow-visible p-0">
          <div className="flex gap-4">
            <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden rounded-lg">
              <Image src={image || "/placeholder.svg"} alt={name || 'Product image'} fill className="object-cover" />
              {badge && (
                <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  {badge}
                </div>
              )}
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="text-sm text-gray-500 mb-1">{category}</div>
                <Link href={`/product/${id}`}>
                  <h3 className="font-semibold text-lg mb-2 text-gray-800 hover:text-blue-600 transition-colors">
                    {productName}
                  </h3>
                </Link>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl font-bold text-blue-600">${price.toFixed(2)}</span>
                  {originalPrice && <span className="text-gray-500 line-through">${originalPrice.toFixed(2)}</span>}
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">{renderStars(rating)}</div>
                  <span className="text-sm text-gray-500">({reviewCount})</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Link
                  href={`/product/${id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  View Details
                </Link>
                <button
                  onClick={handleQuickAddToCart}
                  className="bg-green-600 text-white px-3 py-2 rounded-full hover:bg-green-700 transition-colors text-sm font-medium"
                  disabled={!inStock}
                >
                  {inStock ? "Add to Cart" : "Out of Stock"}
                </button>
                <button
                  onClick={handleWishlistToggle}
                  className={`p-2 rounded-full transition-colors ${
                    isWishlisted ? "text-red-500" : "text-gray-400 hover:text-red-500"
                  }`}
                >
                  <Heart size={20} className={isWishlisted ? "fill-current" : ""} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modals for list view */}
        <AddToCartModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          product={{
            id,
            name: productName,
            price,
            originalPrice,
            image,
            category,
            sizes,
            colors,
            inStock
          }}
        />

        {showAuthPrompt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 shadow-lg text-center max-w-md mx-4">
              <h2 className="text-xl font-bold mb-4">Sign In Required</h2>
              <p className="mb-6">Please sign in to add items to your cart or wishlist.</p>
              <div className="flex gap-3 justify-center">
                <Link 
                  href="/auth/signin" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth/signup" 
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Sign Up
                </Link>
              </div>
              <button
                onClick={() => setShowAuthPrompt(false)}
                className="block mt-4 text-blue-600 underline mx-auto"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </>
    )
  }

  // Grid view (original design)
  return (
    <>
      <div className="overflow-visible group">
        <div className="relative h-64 overflow-hidden">
          <Image
            src={image || "/placeholder.svg"}
            alt={name || 'Product image'}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {badge && (
            <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {badge}
            </div>
          )}
          {!inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Out of Stock</span>
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="text-sm text-gray-500 mb-1">{category}</div>
          <Link href={`/product/${id}`}>
            <h3 className="font-semibold text-lg mb-2 text-gray-800 hover:text-blue-600 transition-colors">{productName}</h3>
          </Link>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl font-bold text-blue-600">${price.toFixed(2)}</span>
            {originalPrice && <span className="text-gray-500 line-through">${originalPrice.toFixed(2)}</span>}
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex">{renderStars(rating)}</div>
            <span className="text-sm text-gray-500">({reviewCount})</span>
          </div>

          <div className="flex justify-between items-center gap-2">
            <Link
              href={`/product/${id}`}
              className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <ShoppingCart size={16} />
              View Details
            </Link>
            <button
              onClick={handleQuickAddToCart}
              className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-colors flex items-center gap-2 text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={!inStock}
            >
              <ShoppingCart size={16} />
              {inStock ? "Add to Cart" : "Out of Stock"}
            </button>
            <button
              onClick={handleWishlistToggle}
              className={`p-2 rounded-full transition-colors ${
                isWishlisted ? "text-red-500" : "text-gray-400 hover:text-red-500"
              }`}
            >
              <Heart size={20} className={isWishlisted ? "fill-current" : ""} />
            </button>
          </div>
        </div>
      </div>

      {/* Add to Cart Modal */}
      <AddToCartModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        product={{
          id,
          name,
          price,
          originalPrice,
          image,
          category,
          sizes,
          colors,
          inStock
        }}
      />

      {/* Authentication Prompt */}
      {showAuthPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 shadow-lg text-center max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Sign In Required</h2>
            <p className="mb-6">Please sign in to add items to your cart or wishlist.</p>
            <div className="flex gap-3 justify-center">
              <Link 
                href="/auth/signin" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Sign In
              </Link>
              <Link 
                href="/auth/signup" 
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                Sign Up
              </Link>
            </div>
            <button
              onClick={() => setShowAuthPrompt(false)}
              className="block mt-4 text-blue-600 underline mx-auto"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  )
}