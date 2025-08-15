"use client"

import React, { useState, useEffect } from "react"

import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { CreditCard, Truck, Shield, ArrowLeft } from "lucide-react"
import { getCart } from "@/lib/cart"
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

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  color: string;
  size: string;
  image: string;
  inStock: boolean;
}

// Remove the static cartItems array and load from localStorage

export default function CheckoutPage() {
  const router = useRouter()
  const { user } = useAuth() // Use the useAuth hook
  const [step, setStep] = useState(1) // 1: Shipping, 2: Payment, 3: Review
  const [searchQuery, setSearchQuery] = useState("")
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  })
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    billingAddress: "same", // 'same' or 'different'
  })
  const [shippingMethod, setShippingMethod] = useState("standard")
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  // Load cart from localStorage on mount and pre-fill phone if user is logged in
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCartItems(getCart())
      if (user && user.email) {
        setShippingInfo((prev) => ({ ...prev, phone: user.email }))
      }
    }
  }, [user])

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = shippingMethod === "delivery" ? 2 : shippingMethod === "overnight" ? 1.25 : 1.5
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + shipping + tax

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(2)
  }

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(3)
  }

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Save order data to localStorage for confirmation page
      if (typeof window !== "undefined") {
        const orderData = {
          orderNumber: "ORD" + Math.floor(100000 + Math.random() * 900000),
          date: new Date().toISOString(),
          shippingInfo,
          paymentInfo,
          shippingMethod,
          cartItems,
          subtotal,
          shipping,
          tax,
          total,
          userId: user?.email, // Add userId for filtering orders
          paymentStatus: "Paid", // New: Add payment status
        }
        // Save the new order to the main orders list for history
        const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
        const updatedOrders = [...existingOrders, orderData];
        localStorage.setItem("orders", JSON.stringify(updatedOrders));
   
            // Also save to lastOrder for the immediate confirmation page
        localStorage.setItem("lastOrder", JSON.stringify(orderData));

        // Cut stock for each product in adminProducts
        const adminProducts: Product[] = JSON.parse(localStorage.getItem("adminProducts") || "[]")
        const updatedAdminProducts = adminProducts.map((prod: Product) => {
          const cartItem = cartItems.find(
            (item) => item.id === prod.id
          )
          if (cartItem && typeof prod.quantity === "number") {
            return { ...prod, quantity: Math.max(0, prod.quantity - cartItem.quantity), inStock: prod.quantity - cartItem.quantity > 0 }
          }
          return prod
        })
        localStorage.setItem("adminProducts", JSON.stringify(updatedAdminProducts))
        localStorage.removeItem("cart")
      }
      // Redirect to order confirmation page
      router.push('/order-confirmation')
    } catch (error) {
      console.error('Error processing order:', error)
      alert("There was an error processing your order. Please try again.")
    }
  }

  const validateCardNumber = (cardNumber: string): boolean => {
    const regex = /^[0-9]{16}$/ // Validate 16-digit card number
    return regex.test(cardNumber)
  }

  const validateExpiryDate = (expiryDate: string): boolean => {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/ // Validate MM/YY format
    return regex.test(expiryDate)
  }

  const validateCVV = (cvv: string): boolean => {
    const regex = /^[0-9]{3}$/ // Validate 3-digit CVV
    return regex.test(cvv)
  }

  const handlePaymentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPaymentInfo((prev) => ({
      ...prev,
      [name]: value,
    }))
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
            <span className="text-gray-800">Checkout</span>
          </div>
        </nav>


        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[
              { step: 1, title: "Shipping" },
              { step: 2, title: "Payment" },
              { step: 3, title: "Review" },
            ].map((item) => (
              <div key={item.step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= item.step ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {item.step}
                </div>
                <span className={`ml-2 ${step >= item.step ? "text-blue-600" : "text-gray-600"}`}>{item.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping Information */}
            {step === 1 && (
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.firstName}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="Enter your first name"
                        aria-label="First Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.lastName}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="Enter your last name"
                        aria-label="Last Name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        required
                        value={shippingInfo.email}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="Enter your email address"
                        aria-label="Email Address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        required
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      />
                    </div>
                  </div>


                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input type="text"
                      required
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.state}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.zipCode}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Shipping Method */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Shipping Method</h3>
                    <div className="space-y-3">
                      {[
                        { id: "standard", name: "Standard Shipping(Province)", time: "2 business days", price: 1.50},
                        { id: "overnight", name: "Overnight Shipping(Phnom Penh)", time: "1 business days", price: 1.25 },
                        { id: "delivery", name: "Delivery(Phnom Penh)", time: "Delivery after confirmation", price: 2.00 },
                      ].map((method) => (
                        <label
                          key={method.id}
                          className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                        >
                          <input
                            type="radio"
                            name="shipping"
                            value={method.id}
                            checked={shippingMethod === method.id}
                            onChange={(e) => setShippingMethod(e.target.value)}
                            className="mr-3"
                          />
                          <div className="flex-1">
                            <div className="font-medium">{method.name}</div>
                            <div className="text-sm text-gray-600">{method.time}</div>
                          </div>
                          <div className="font-semibold">${method.price.toFixed(2)}</div>
                        </label>
                      ))}
                    </div>
                  </div>


                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Continue to Payment
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: Payment Information */}
            {step === 2 && (
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <div className="flex items-center mb-6">
                  <button
                    onClick={() => setStep(1)}
                    className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Go back to shipping information"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <h2 className="text-2xl font-bold">Payment Information</h2>
                </div>

                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={paymentInfo.cardNumber}
                      onChange={handlePaymentInputChange}
                      required
                      aria-label="Card Number"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${
                        validateCardNumber(paymentInfo.cardNumber) ? "border-gray-300 focus:ring-2 focus:ring-blue-600" : "border-red-500"
                      }`}
                    />
                    {!validateCardNumber(paymentInfo.cardNumber) && paymentInfo.cardNumber && (
                      <p className="text-red-500 text-sm mt-1">Invalid card number</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        name="expiryDate"
                        placeholder="MM/YY"
                        value={paymentInfo.expiryDate}
                        onChange={handlePaymentInputChange}
                        required
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${
                          validateExpiryDate(paymentInfo.expiryDate) ? "border-gray-300 focus:ring-2 focus:ring-blue-600" : "border-red-500"
                        }`}
                      />
                      {!validateExpiryDate(paymentInfo.expiryDate) && paymentInfo.expiryDate && (
                        <p className="text-red-500 text-sm mt-1">Invalid expiry date</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                      <input
                        type="text"
                        name="cvv"
                        placeholder="123"
                        value={paymentInfo.cvv}
                        onChange={handlePaymentInputChange}
                        required
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${
                          validateCVV(paymentInfo.cvv) ? "border-gray-300 focus:ring-2 focus:ring-blue-600" : "border-red-500"
                        }`}
                      />
                      {!validateCVV(paymentInfo.cvv) && paymentInfo.cvv && (
                        <p className="text-red-500 text-sm mt-1">Invalid CVV</p>
                      )}
                    </div>
                  </div>


                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      name="cardholderName"
                      value={paymentInfo.cardholderName}
                      onChange={handlePaymentInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Review Order
                  </button>
                </form>
              </div>
            )}

            {/* Step 3: Order Review */}
            {step === 3 && (
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <div className="flex items-center mb-6">
                  <button
                    onClick={() => setStep(2)}
                    className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <h2 className="text-2xl font-bold">Review Your Order</h2>
                </div>

                {/* Shipping Info Review */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Shipping Address</h3>
                  <p className="text-gray-600">
                    {shippingInfo.firstName} {shippingInfo.lastName}
                    <br />
                    {shippingInfo.address}
                    <br />
                    {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
                  </p>
                </div>

                {/* Payment Info Review */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Payment Method</h3>
                  <p className="text-gray-600">
                    **** **** **** {paymentInfo.cardNumber.slice(-4)}
                    <br />
                    {paymentInfo.cardholderName}
                  </p>
                </div>

                <form onSubmit={handleFinalSubmit}>
                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    Place Order
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-md sticky top-24">
              <h3 className="text-xl font-bold mb-4">Order Summary</h3>

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartItems.length === 0 ? (
                  <div className="text-gray-500 text-center">No items in your cart.</div>
                ) : (
                  cartItems.map((item) => (
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
                  ))
                )}
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
                  <Shield size={16} className="mr-2" />
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Truck size={16} className="mr-2" />
                  <span>Free returns</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CreditCard size={16} className="mr-2" />
                  <span>Payment protection</span>
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