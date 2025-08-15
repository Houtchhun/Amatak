"use client"

import { useEffect, useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import HeroBanner from "@/components/hero-banner"
import ProductCard from "@/components/product-card"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("") // State for search query
  const [cart, setCart] = useState([]) // State for cart
  const [allProducts, setAllProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [mensResponse, womensResponse] = await Promise.all([
          fetch("https://fakestoreapi.com/products/category/men's clothing"),
          fetch("https://fakestoreapi.com/products/category/women's clothing")
        ]);
        const mensData = await mensResponse.json();
        const womensData = await womensResponse.json();
        const combinedData = [...mensData, ...womensData];
        const normalizedProducts = combinedData.map(p => ({ ...p, name: p.title }));
        setAllProducts(normalizedProducts);
      } catch (error) {
        console.error("Error fetching products:", error)
      }
    }
    fetchProducts()
  }, [])

  const handleAddToCart = (product) => {
    setCart((prevCart) => [...prevCart, product])
    alert(`${product.name} added to cart!`)
  }

  // Process products for specific sections
  const latestProducts = allProducts.slice(0, 8);
  const discountProducts = allProducts
    .map(p => ({ ...p, originalPrice: p.price * 1.2 })) // Simulate a 20% discount
    .slice(0, 8);
  const bestSellerProducts = [...allProducts].sort((a, b) => (b.rating?.count || 0) - (a.rating?.count || 0)).slice(0, 8);
  const recommendedProducts = [...allProducts].sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0)).slice(0, 8);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />


      <main>
        <HeroBanner />


        {/* Search Results Section */}
        {searchQuery ? (
          <section className="container mx-auto px-4 py-12">
            <h2 className="text-4xl font-bold text-center mb-8 text-gray-800 relative">
              Search Results
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-orange-500 mt-2"></span>
            </h2>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allProducts
                .filter((product) =>
                  product.name?.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((product) => (
                  <ProductCard key={product.id} {...product} onAddToCart={() => handleAddToCart(product)} />
                ))}
            </div>
          </section>
        ) : (
          <>
            {/* Latest Products Section */}
            <section className="container mx-auto px-4 py-12">
              <h2 className="text-4xl font-bold text-center mb-8 text-gray-800 relative">
                Latest Products
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-orange-500 mt-2"></span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {latestProducts.map((product) => (
                  <ProductCard key={product.id} {...product} onAddToCart={() => handleAddToCart(product)} />
                ))}
              </div>
            </section>

            {/* Discounted Products Section */}
            <section className="container mx-auto px-4 py-12">
              <h2 className="text-4xl font-bold text-center mb-8 text-gray-800 relative">
                Discounted Products
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-orange-500 mt-2"></span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {discountProducts.map((product) => (
                  <ProductCard key={product.id} {...product} onAddToCart={() => handleAddToCart(product)} />
                ))}
              </div>
            </section>

            {/* Best-Selling Products Section */}
            <section className="container mx-auto px-4 py-12">
              <h2 className="text-4xl font-bold text-center mb-8 text-gray-800 relative">
                Best-Sellers
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-orange-500 mt-2"></span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {bestSellerProducts.map((product) => (
                  <ProductCard key={product.id} {...product} onAddToCart={() => handleAddToCart(product)} />
                ))}
              </div>
            </section>

            {/* Recommended Products Section */}
            <section className="container mx-auto px-4 py-12">
              <h2 className="text-4xl font-bold text-center mb-8 text-gray-800 relative">
                Recommended for You
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-orange-500 mt-2"></span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recommendedProducts.map((product) => (
                  <ProductCard key={product.id} {...product} onAddToCart={() => handleAddToCart(product)} />
                ))}
              </div>
            </section>
          </>
        )}

      </main>

      <Footer />
    </div>
  )
}