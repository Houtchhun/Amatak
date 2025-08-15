"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, Check, ShoppingCart, Heart } from "lucide-react"
import { addToCart } from "@/lib/cart"
import { useAuth } from "@/lib/AuthContext"

export default function AddToCartModal({ isOpen, onClose, product }) {
  const [showSuccess, setShowSuccess] = useState(false)
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || "M")
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0]?.name || "default")
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState("")
  const { isAuthenticated } = useAuth()

  if (!isOpen) return null

  const handleAddToCart = () => {
    setError("")
    
    if (!isAuthenticated) {
      setError("Please sign in to add items to cart")
      return
    }

    try {
      // Actually add to cart using the real function
      addToCart({
        id: product.id,
        name: product.name || product.title || "Product",
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        color: selectedColor,
        size: selectedSize,
        quantity: quantity,
        category: product.category,
        inStock: product.inStock !== false
      })
      
      setShowSuccess(true)

      // Auto close after 2 seconds
      setTimeout(() => {
        setShowSuccess(false)
        onClose()
      }, 2000)
    } catch (err) {
      setError("Failed to add item to cart. Please try again.")
    }
  }

  const handleWishlist = () => {
    if (!isAuthenticated) {
      setError("Please sign in to add items to wishlist")
      return
    }
    
    // Add to wishlist logic
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
    if (!wishlist.includes(product.id)) {
      wishlist.push(product.id)
      localStorage.setItem("wishlist", JSON.stringify(wishlist))
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        {!showSuccess ? (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add to Cart</h2>

            <div className="flex gap-4 mb-6">
              <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name || "Product image"}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-1">{product.name}</h3>
                <p className="text-blue-600 font-bold text-lg">${product.price.toFixed(2)}</p>
                {product.originalPrice && (
                  <p className="text-sm text-gray-500 line-through">${product.originalPrice.toFixed(2)}</p>
                )}
              </div>
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Size:</label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {product.sizes.map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Color:</label>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {product.colors.map((color) => (
                    <option key={color.name} value={color.name}>{color.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Quantity Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity:</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center border border-gray-300 rounded-lg px-2 py-1"
                />
                <button
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>

              <button 
                onClick={handleWishlist}
                className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Heart size={20} />
                Add to Wishlist
              </button>
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <Check size={16} className="mr-2 text-green-500" />
                <span>Free shipping on orders over $100</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <Check size={16} className="mr-2 text-green-500" />
                <span>30-day return policy</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Check size={16} className="mr-2 text-green-500" />
                <span>2-year warranty included</span>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Added to Cart!</h2>
            <p className="text-gray-600 mb-6">{product.name} has been added to your cart.</p>

            <div className="flex gap-3">
              <Link
                href="/cart"
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
              >
                View Cart
              </Link>
              <Link
                href="/shop"
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
