"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { CreditCard, Lock, ArrowLeft, Check } from "lucide-react"
import { getCart, clearCart } from "@/lib/cart"

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

export default function PaymentPage() {
	const [paymentMethod, setPaymentMethod] = useState("card")
	const [cardInfo, setCardInfo] = useState({
		cardNumber: "",
		expiryDate: "",
		cvv: "",
		cardholderName: "",
	})
	const [billingAddress, setBillingAddress] = useState({
		firstName: "",
		lastName: "",
		address: "",
		city: "",
		state: "",
		zipCode: "",
		country: "United States",
	})
	const [sameAsShipping, setSameAsShipping] = useState(true)
	const [processing, setProcessing] = useState(false)
	const [cartItems, setCartItems] = useState<CartItem[]>([])

	useEffect(() => {
		if (typeof window !== "undefined") {
			setCartItems(getCart())
		}
	}, [])

	// Use cartItems instead of orderItems
	const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
	const shipping = 5.99
	const tax = subtotal * 0.08
	const total = subtotal + shipping + tax

	const handleCardInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setCardInfo((prev) => ({ ...prev, [name]: value }))
	}

	const handleBillingAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target
		setBillingAddress((prev) => ({ ...prev, [name]: value }))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setProcessing(true)

		// Simulate payment processing
		setTimeout(() => {
			setProcessing(false)
			// Save order data to localStorage for confirmation page
			if (typeof window !== "undefined") {
				const orderData = {
					orderNumber: "ORD" + Math.floor(100000 + Math.random() * 900000),
					date: new Date().toISOString(),
					paymentMethod,
					cardInfo,
					billingAddress: sameAsShipping ? "same" : billingAddress,
					cartItems,
					subtotal,
					shipping,
					tax,
					total,
				}
				localStorage.setItem("lastOrder", JSON.stringify(orderData))
				clearCart(); // Clear the user's cart after payment
			}
			// Redirect to order confirmation page
			window.location.href = "/order-confirmation"
		}, 3000)
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<Header />

			<main className="container mx-auto px-4 py-8">
				{/* Breadcrumb */}
				<nav className="mb-8">
					<div className="flex items-center space-x-2 text-sm text-gray-600">
						<Link href="/" className="hover:text-blue-600">
							Home
						</Link>
						<span>/</span>
						<Link href="/cart" className="hover:text-blue-600">
							Cart
						</Link>
						<span>/</span>
						<Link href="/checkout" className="hover:text-blue-600">
							Checkout
						</Link>
						<span>/</span>
						<span className="text-gray-800">Payment</span>
					</div>
				</nav>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Payment Form */}
					<div className="lg:col-span-2">
						<div className="bg-white rounded-2xl shadow-md p-6">
							<div className="flex items-center mb-6">
								<Link href="/checkout" className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
									<ArrowLeft size={20} />
								</Link>
								<h1 className="text-2xl font-bold text-gray-800">Payment Information</h1>
							</div>

							<form onSubmit={handleSubmit} className="space-y-6">
								{/* Payment Method Selection */}
								<div>
									<h3 className="text-lg font-semibold mb-4">Payment Method</h3>
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										<label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
											<input
												type="radio"
												name="paymentMethod"
												value="card"
												checked={paymentMethod === "card"}
												onChange={(e) => setPaymentMethod(e.target.value)}
												className="mr-3"
											/>
											<CreditCard size={20} className="mr-2" />
											<span>Credit Card</span>
										</label>
										<label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
											<input
												type="radio"
												name="paymentMethod"
												value="paypal"
												checked={paymentMethod === "paypal"}
												onChange={(e) => setPaymentMethod(e.target.value)}
												className="mr-3"
											/>
											<div className="w-5 h-5 bg-blue-600 rounded mr-2"></div>
											<span>PayPal</span>
										</label>
										<label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
											<input
												type="radio"
												name="paymentMethod"
												value="apple"
												checked={paymentMethod === "apple"}
												onChange={(e) => setPaymentMethod(e.target.value)}
												className="mr-3"
											/>
											<div className="w-5 h-5 bg-black rounded mr-2"></div>
											<span>Apple Pay</span>
										</label>
									</div>
								</div>

								{/* Credit Card Form */}
								{paymentMethod === "card" && (
									<div className="space-y-4">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
											<input
												type="text"
												name="cardNumber"
												placeholder="1234 5678 9012 3456"
												value={cardInfo.cardNumber}
												onChange={handleCardInfoChange}
												required
												className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
											/>
										</div>

										<div className="grid grid-cols-2 gap-4">
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
												<input
													type="text"
													name="expiryDate"
													placeholder="MM/YY"
													value={cardInfo.expiryDate}
													onChange={handleCardInfoChange}
													required
													className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
												/>
											</div>
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
												<input
													type="text"
													name="cvv"
													placeholder="123"
													value={cardInfo.cvv}
													onChange={handleCardInfoChange}
													required
													className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
												/>
											</div>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
											<input
												type="text"
												name="cardholderName"
												placeholder="John Doe"
												value={cardInfo.cardholderName}
												onChange={handleCardInfoChange}
												required
												className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
											/>
										</div>
									</div>
								)}

								{/* PayPal */}
								{paymentMethod === "paypal" && (
									<div className="text-center py-8">
										<div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
											<span className="text-white font-bold text-xl">PP</span>
										</div>
										<p className="text-gray-600 mb-4">You will be redirected to PayPal to complete your payment.</p>
									</div>
								)}

								{/* Apple Pay */}
								{paymentMethod === "apple" && (
									<div className="text-center py-8">
										<div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
											<span className="text-white font-bold text-xl">🍎</span>
										</div>
										<p className="text-gray-600 mb-4">Use Touch ID or Face ID to pay with Apple Pay.</p>
									</div>
								)}

								{/* Billing Address */}
								<div>
									<h3 className="text-lg font-semibold mb-4">Billing Address</h3>
									<label className="flex items-center mb-4">
										<input
											type="checkbox"
											checked={sameAsShipping}
											onChange={(e) => setSameAsShipping(e.target.checked)}
											className="mr-2"
										/>
										<span>Same as shipping address</span>
									</label>

									{!sameAsShipping && (
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<input
												type="text"
												name="firstName"
												placeholder="First Name"
												value={billingAddress.firstName}
												onChange={handleBillingAddressChange}
												required
												className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
											/>
											<input
												type="text"
												name="lastName"
												placeholder="Last Name"
												value={billingAddress.lastName}
												onChange={handleBillingAddressChange}
												required
												className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
											/>
											<input
												type="text"
												name="address"
												placeholder="Address"
												value={billingAddress.address}
												onChange={handleBillingAddressChange}
												required
												className="md:col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
											/>
											<input
												type="text"
												name="city"
												placeholder="City"
												value={billingAddress.city}
												onChange={handleBillingAddressChange}
												required
												className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
											/>
											<input
												type="text"
												name="state"
												placeholder="State"
												value={billingAddress.state}
												onChange={handleBillingAddressChange}
												required
												className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
											/>
											<input
												type="text"
												name="zipCode"
												placeholder="ZIP Code"
												value={billingAddress.zipCode}
												onChange={handleBillingAddressChange}
												required
												className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
											/>
											<select
												name="country"
												value={billingAddress.country}
												onChange={handleBillingAddressChange}
												className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
											>
												<option value="United States">United States</option>
												<option value="Canada">Canada</option>
												<option value="United Kingdom">United Kingdom</option>
											</select>
										</div>
									)}
								</div>

								{/* Submit Button */}
								<button
									type="submit"
									disabled={processing}
									className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
								>
									{processing ? (
										<>
											<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
											Processing Payment...
										</>
									) : (
										<>
											<Lock size={20} />
											Complete Payment ${total.toFixed(2)}
										</>
									)}
								</button>
							</form>
						</div>
					</div>

					{/* Order Summary */}
					<div className="lg:col-span-1">
						<div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
							<h2 className="text-xl font-bold mb-6">Order Summary</h2>

							{/* Order Items */}
							<div className="space-y-4 mb-6">
								{cartItems.map((item) => (
									<div key={`${item.id}-${item.color}-${item.size}`} className="flex items-center space-x-3">
										<div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
											<Image
												src={item.image || "/placeholder.svg"}
												alt={item.name}
												width={64}
												height={64}
												className="object-cover w-full h-full"
											/>
										</div>
										<div className="flex-1">
											<h4 className="font-medium text-sm">{item.name}</h4>
											<p className="text-xs text-gray-600">
												{item.color} • Size {item.size} • Qty {item.quantity}
											</p>
										</div>
										<div className="font-semibold">${(item.price * item.quantity).toFixed(2)}</div>
									</div>
								))}
							</div>

							{/* Order Totals */}
							<div className="space-y-2 border-t pt-4">
								<div className="flex justify-between">
									<span>Subtotal</span>
									<span>${subtotal.toFixed(2)}</span>
								</div>
								<div className="flex justify-between">
									<span>Shipping</span>
									<span>${shipping.toFixed(2)}</span>
								</div>
								<div className="flex justify-between">
									<span>Tax</span>
									<span>${tax.toFixed(2)}</span>
								</div>
								<div className="flex justify-between font-bold text-lg border-t pt-2">
									<span>Total</span>
									<span>${total.toFixed(2)}</span>
								</div>
							</div>

							{/* Security Features */}
							<div className="mt-6 pt-6 border-t space-y-3">
								<div className="flex items-center text-sm text-gray-600">
									<Check size={16} className="mr-2 text-green-500" />
									<span>SSL encrypted checkout</span>
								</div>
								<div className="flex items-center text-sm text-gray-600">
									<Check size={16} className="mr-2 text-green-500" />
									<span>Money-back guarantee</span>
								</div>
								<div className="flex items-center text-sm text-gray-600">
									<Check size={16} className="mr-2 text-green-500" />
									<span>24/7 customer support</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	)
}
