"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import AddToCartModal from "@/components/add-to-cart-modal"
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw } from 'lucide-react'

const ProductDetailPage = () => {
  const params = useParams()
  const productId = params.id
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedImage, setSelectedImage] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        setLoading(true);
        try {
          if (productId.startsWith('admin-')) {
            // It's an admin product, load from localStorage
            const storedAdminProducts = localStorage.getItem('adminProducts');
            if (storedAdminProducts) {
              const adminProducts = JSON.parse(storedAdminProducts);
              const product = adminProducts.find(p => `admin-${p.id}` === productId);
              setProduct(product);
            } else {
              setProduct(null);
            }
          } else {
            // It's an API product, fetch from the API
            const fetchId = productId.replace('api-', '');
            const response = await fetch(`https://fakestoreapi.com/products/${fetchId}`);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const text = await response.text();
            const data = text ? JSON.parse(text) : null;
            setProduct(data);
          }
        } catch (error) {
          console.error("Error fetching product:", error);
          setProduct(null);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [productId]);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      // Set default color and size if they exist
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0].name);
      }
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
    }
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Loading...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold text-red-600">Product Not Found</h1>
          <p className="mt-4 text-lg text-gray-700">The product with ID "{productId}" does not exist.</p>
          <Link href="/" className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
            Go to Homepage
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const handleAddToCart = () => {
    const colorValue = (product.colors && product.colors.length > 0) ? selectedColor : "default";
    const sizeValue = (product.sizes && product.sizes.length > 0) ? selectedSize : "default";

    if ((product.colors && product.colors.length > 0 && !selectedColor) || (product.sizes && product.sizes.length > 0 && !selectedSize)) {
      alert("Please select a color and size.");
      return;
    }

    let cart = []
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cartItems")
      cart = stored ? JSON.parse(stored) : []
    }

    const idx = cart.findIndex(item => item.id === product.id && item.color === colorValue && item.size === sizeValue);
    if (idx > -1) {
      cart[idx].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.title, // Use title from API
        color: colorValue,
        size: sizeValue,
        quantity,
        price: product.price,
        image: product.image,
        inStock: true, // Assuming in stock
      });
    }
    localStorage.setItem("cartItems", JSON.stringify(cart));
    setIsModalOpen(true);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <main className="container mx-auto p-4 md:p-8 flex-grow">
        <div className="flex flex-col lg:flex-row gap-8 bg-white p-6 rounded-lg shadow-md">
          {/* Product Images */}
          <div className="lg:w-1/2 flex flex-col items-center">
            <div className="w-full max-w-lg h-96 relative rounded-lg overflow-hidden border border-gray-200">
              {selectedImage && <Image
                src={selectedImage}
                alt={product.title || product.name}
                layout="fill"
                objectFit="contain"
                className="rounded-lg"
                onError={(e) => { e.target.src = 'https://placehold.co/400x400/cccccc/000000?text=Image+Not+Found'; }}
              />}
            </div>
            {/* Thumbnails can be added here if the API provides multiple images */}
          </div>

          {/* Product Details */}
          <div className="lg:w-1/2 flex flex-col gap-4">
            <h1 className="text-3xl font-bold text-gray-900">{product.title || product.name}</h1>
            <p className="text-gray-600 text-lg">{product.category}</p>

            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400">
                {product.rating && [...Array(5)].map((_, i) => (
                  <Star key={i} fill={i < Math.floor(product.rating.rate) ? 'currentColor' : 'none'} size={20} />
                ))}
              </div>
              <span className="text-gray-600">({product.rating ? product.rating.count : 0} Reviews)</span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-gray-900">${product.price ? product.price.toFixed(2) : '0.00'}</span>
            </div>

            <p className="text-gray-700 leading-relaxed">{product.description}</p>

            {/* Quantity */}
            <div className="flex items-center gap-4 mt-4">
              <h3 className="text-lg font-semibold text-gray-800">Quantity:</h3>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-20 p-2 border border-gray-300 rounded-md text-center"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                onClick={handleAddToCart}
              >
                <ShoppingCart size={20} /> Add to Cart
              </button>
              <button className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg text-lg font-semibold hover:bg-gray-300 transition flex items-center justify-center gap-2">
                <Heart size={20} /> Add to Wishlist
              </button>
            </div>

            {/* Shipping & Returns */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
              <div className="flex items-center gap-3 bg-gray-100 p-4 rounded-lg">
                <Truck size={24} className="text-blue-600" />
                <div>
                  <h4 className="font-semibold">Free Shipping</h4>
                  <p className="text-sm">On all orders over $50</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-100 p-4 rounded-lg">
                <RotateCcw size={24} className="text-blue-600" />
                <div>
                  <h4 className="font-semibold">Easy Returns</h4>
                  <p className="text-sm">30-day money-back guarantee</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-100 p-4 rounded-lg">
                <Shield size={24} className="text-blue-600" />
                <div>
                  <h4 className="font-semibold">Secure Payment</h4>
                  <p className="text-sm">100% protected transactions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      {product && <AddToCartModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} product={product} quantity={quantity} />}
    </div>
  )
}

export default ProductDetailPage