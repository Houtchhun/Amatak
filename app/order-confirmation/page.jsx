"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function OrderConfirmation() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const lastOrder = localStorage.getItem("lastOrder");
      if (lastOrder) {
        setOrder(JSON.parse(lastOrder));
      }
    }
  }, []);

  // Download receipt as text file
  const handleDownload = () => {
    if (!order) return;
    let receipt = `Order Receipt\n`;
    receipt += `Order Number: ${order.orderNumber}\n`;
    receipt += `Date: ${order.date ? new Date(order.date).toLocaleDateString() : ""}\n`;
    receipt += `Payment Method: ${order.paymentMethod ? order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1) : "Credit Card"}\n`;
    if (order.shippingInfo) {
      receipt += `Shipping: ${order.shippingInfo.firstName} ${order.shippingInfo.lastName}, ${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state} ${order.shippingInfo.zipCode}\n`;
    }
    receipt += `\nItems:\n`;
    order.cartItems.forEach((item, idx) => {
      receipt += `${idx + 1}. ${item.name} (${item.color} / Size ${item.size}) x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}\n`;
    });
    receipt += `\nSubtotal: $${order.subtotal?.toFixed(2)}\n`;
    receipt += `Shipping: $${order.shipping?.toFixed(2)}\n`;
    receipt += `Tax: $${order.tax?.toFixed(2)}\n`;
    receipt += `Total: $${order.total?.toFixed(2)}\n`;

    const blob = new Blob([receipt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-${order.orderNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow text-center">
          <h2 className="text-xl font-bold mb-2">No order found</h2>
          <p className="mb-4">You have not placed an order yet.</p>
          <Link href="/" className="text-blue-600 font-semibold hover:underline">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const { orderNumber, date, cartItems, subtotal, shipping, tax, total, shippingInfo, paymentInfo, paymentMethod } = order;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-md p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-3">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Thank you for your purchase!</h2>
            <p className="text-gray-600">Your payment was successful.</p>
          </div>
          <div className="mb-6 border rounded-lg bg-gray-50 p-4">
            <h3 className="font-semibold mb-2 text-lg">Order Receipt</h3>
            <div className="text-sm text-gray-700 mb-2">
              <div>
                <span className="font-medium">Order Number:</span> {orderNumber}
              </div>
              <div>
                <span className="font-medium">Date:</span> {date ? new Date(date).toLocaleDateString() : ""}
              </div>
              <div>
                <span className="font-medium">Payment Method:</span> {paymentMethod ? paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1) : "Credit Card"}
              </div>
            </div>
            {shippingInfo && (
              <div className="mt-2 text-xs text-gray-600">
                <div>
                  <span className="font-medium">Shipping:</span>{" "}
                  {shippingInfo.firstName} {shippingInfo.lastName}, {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
                </div>
              </div>
            )}
          </div>
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Items</h4>
            <div className="divide-y">
              {cartItems && cartItems.length === 0 ? (
                <div className="text-gray-500 text-center py-4">No items found.</div>
              ) : (
                cartItems &&
                cartItems.map((item, idx) => (
                  <div key={idx} className="flex items-center py-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden mr-4">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-xs text-gray-600">
                        {item.color} • Size {item.size} • Qty {item.quantity}
                      </div>
                    </div>
                    <div className="font-semibold text-right w-20">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="mb-6 border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${shipping?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${tax?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-base border-t pt-2">
              <span>Total</span>
              <span>${total?.toFixed(2)}</span>
            </div>
          </div>rtrtrtr
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-2">
              If you have any questions, please contact our support team.
            </p>
            <button
              onClick={handleDownload}
              className="inline-block mt-2 mr-2 bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition"
            >
              Download Receipt
            </button>
            <Link href="/" className="inline-block mt-2 text-blue-600 font-semibold hover:underline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
