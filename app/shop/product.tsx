"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import { getCart, addToCart } from "@/lib/cart"
import { useAuth } from "@/lib/AuthContext"

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  color: string;
  size: string;
  image: string;
  originalPrice?: number;
  inStock?: boolean;
}

export default function CartPage() {
	const [cartItems, setCartItems] = useState<CartItem[]>([])
	const [searchQuery, setSearchQuery] = useState("")
	const [showAuthPrompt, setShowAuthPrompt] = useState(false)
	const { isAuthenticated } = useAuth()

	// Load cart from shared cart logic on mount
	useEffect(() => {
		if (typeof window !== "undefined") {
			setCartItems(getCart())
		}
	}, [])

	// Listen for changes to cart in LocalStorage from other tabs/windows or after add-to-cart
	useEffect(() => {
		const handleStorage = (event: StorageEvent) => {
			if (event.key === "cart") {
				setCartItems(getCart())
			}
		}
		window.addEventListener("storage", handleStorage)
		return () => window.removeEventListener("storage", handleStorage)
	}, [])

	// Always reload cart from LocalStorage on mount and when route changes (SPA navigation)
	useEffect(() => {
		const updateCart = () => {
			if (typeof window !== "undefined") {
				setCartItems(getCart())
			}
		}
		updateCart()
		window.addEventListener("focus", updateCart)
		return () => window.removeEventListener("focus", updateCart)
	}, [])

	const updateQuantity = (id: string, color: string, size: string, newQuantity: number) => {
		if (newQuantity < 1) return
		setCartItems((items) =>
			items.map((item) =>
				item.id === id && item.color === color && item.size === size ? { ...item, quantity: newQuantity } : item,
			),
		)
		// Save updated cart to LocalStorage
		if (typeof window !== "undefined") {
			const updated = cartItems.map((item) =>
				item.id === id && item.color === color && item.size === size ? { ...item, quantity: newQuantity } : item,
			)
			localStorage.setItem("cart", JSON.stringify(updated))
		}
	}

	const removeItem = (id: string, color: string, size: string) => {
		const updated = cartItems.filter((item) => !(item.id === id && item.color === color && item.size === size))
		setCartItems(updated)
		if (typeof window !== "undefined") {
			localStorage.setItem("cart", JSON.stringify(updated))
		}
	}

	

	const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
	const savings = cartItems.reduce((sum, item) => {
		if (item.originalPrice) {
			return sum + (item.originalPrice - item.price) * item.quantity
		}
		return sum
	}, 0)
	const shipping = subtotal > 100 ? 0 : 9.99
	const tax = subtotal * 0.08 // 8% tax
	const total = subtotal + shipping + tax

	if (cartItems.length === 0) {
		return (
			<div className="min-h-screen bg-gray-50">
				<Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
				<main className="container mx-auto px-4 py-16">
					<div className="text-center">
						<ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
						<h1 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h1>
						<p className="text-gray-600 mb-8">Looks like you haven&apos;t added any items to your cart yet.</p>
						<Link
							href="/shop"
							className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
						>
							Continue Shopping
							<ArrowRight size={20} />
						</Link>
					</div>
				</main>
				<Footer />
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

			<main className="container mx-auto px-4 py-8">
				{/* Breadcrumb */}
				<nav className="mb-8">
					<div className="flex items-center space-x-2 text-sm text-gray-600">
						<Link href="/" className="hover:text-blue-600">
							Home
						</Link>
						<span>/</span>
						<Link href="/shop" className="hover:text-blue-600">
							Shop
						</Link>
						<span>/</span>
						<span className="text-gray-800">Shopping Cart</span>
					</div>
				</nav>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Cart Items */}
					<div className="lg:col-span-2">
						<div className="bg-white rounded-2xl shadow-md overflow-hidden">
							<div className="p-6 border-b">
								<h1 className="text-2xl font-bold text-gray-800">Shopping Cart</h1>
								<p className="text-gray-600">{cartItems.length} items in your cart</p>
							</div>

							<div className="divide-y">
								{cartItems.map((item) => (
									<div key={`${item.id}-${item.color}-${item.size}`} className="p-6">
										<div className="flex gap-4">
											{/* Product Image */}
											<div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
												<Image
													src={typeof item.image === "string" && item.image ? item.image : "/placeholder.svg"}
													alt={item.name || "Product image"}
													width={96}
													height={96}
													className="object-cover w-full h-full"
												/>
											</div>

											{/* Product Details */}
											<div className="flex-1">
												<div className="flex justify-between items-start mb-2">
													<div>
														<h3 className="font-semibold text-gray-800">{item.name}</h3>
														<p className="text-sm text-gray-600">
															Color: {item.color === "default" ? "—" : item.color} • Size:{" "}
															{item.size === "default" ? "—" : item.size}
														</p>
														{item.inStock === false && <p className="text-sm text-red-600 font-medium">Out of stock</p>}
													</div>
													<button
														onClick={() => removeItem(item.id, item.color, item.size)}
														className="text-gray-400 hover:text-red-500 transition-colors p-1"
													>
														<Trash2 size={18} />
													</button>
												</div>

												<div className="flex justify-between items-center">
													{/* Price */}
													<div className="flex items-center gap-2">
														<span className="font-bold text-blue-600">
															${typeof item.price === "number" ? item.price.toFixed(2) : "0.00"}
														</span>
														{typeof item.originalPrice === "number" && (
															<span className="text-sm text-gray-500 line-through">
																${item.originalPrice.toFixed(2)}
															</span>
														)}
													</div>

													{/* Quantity Controls */}
													<div className="flex items-center gap-3">
														<button
															onClick={() => updateQuantity(item.id, item.color, item.size, item.quantity - 1)}
															className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
															disabled={item.inStock === false}
														>
															<Minus size={16} />
														</button>
														<span className="w-8 text-center font-medium">
															{typeof item.quantity === "number" ? item.quantity : 1}
														</span>
														<button
															onClick={() => updateQuantity(item.id, item.color, item.size, item.quantity + 1)}
															className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
															disabled={item.inStock === false}
														>
															<Plus size={16} />
														</button>
													</div>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Continue Shopping */}
						<div className="mt-6">
							<Link
								href="/shop"
								className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-2"
							>
								← Continue Shopping
							</Link>
						</div>
					</div>

					{/* Order Summary */}
					<div className="lg:col-span-1">
						<div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
							<h2 className="text-xl font-bold mb-6">Order Summary</h2>

							<div className="space-y-3 mb-6">
								<div className="flex justify-between">
									<span>Subtotal</span>
									<span>${subtotal.toFixed(2)}</span>
								</div>
								{ savings > 0 && (
									<div className="flex justify-between text-green-600">
										<span>Savings</span>
										<span>-${savings.toFixed(2)}</span>
									</div>
								)}
								<div className="flex justify-between">
									<span>Shipping</span>
									<span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
								</div>
								<div className="flex justify-between">
									<span>Tax</span>
									<span>${tax.toFixed(2)}</span>
								</div>
								<div className="border-t pt-3">
									<div className="flex justify-between font-bold text-lg">
										<span>Total</span>
										<span>${total.toFixed(2)}</span>
									</div>
								</div>
							</div>

							{shipping > 0 && (
								<div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
									<p className="text-sm text-blue-800">Add ${(100 - subtotal).toFixed(2)} more for free shipping!</p>
								</div>
							)}

							<Link
								href="/checkout"
								className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center block"
							>
								Proceed to Checkout
							</Link>

							{/* Security Features */}
							<div className="mt-6 pt-6 border-t space-y-2">
								<div className="flex items-center text-sm text-gray-600">
									<span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
									<span>Secure checkout</span>
								</div>
								<div className="flex items-center text-sm text-gray-600">
									<span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
									<span>Free returns within 30 days</span>
								</div>
								<div className="flex items-center text-sm text-gray-600">
									<span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
									<span>2-year warranty included</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>

			<Footer />

			{/* Authentication Prompt */}
			{showAuthPrompt && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-8 shadow-lg text-center">
						<h2 className="text-xl font-bold mb-4">Login Required</h2>
						<p className="mb-6">Please login or register before adding items to your cart.</p>
						<Link href="/auth/signin" className="bg-blue-600 text-white px-4 py-2 rounded-lg mr-2">
							Login
						</Link>
						<Link href="/auth/signup" className="bg-gray-200 px-4 py-2 rounded-lg">
							Register
						</Link>
						<button
							onClick={() => setShowAuthPrompt(false)}
							className="block mt-4 text-blue-600 underline mx-auto"
						>
							Cancel
						</button>
					</div>
				</div>
			)}
		</div>
	)
}