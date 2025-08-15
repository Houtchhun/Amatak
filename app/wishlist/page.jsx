"use client"

import { useEffect, useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ProductList from "@/components/product-list"
import { allProducts as staticProducts } from "@/data/products"
import Link from "next/link"

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([])
  const [products, setProducts] = useState([])
  const [apiProducts, setApiProducts] = useState([]) // New state for API products
  const [searchQuery, setSearchQuery] = useState("")

      useEffect(() => {
         if (typeof window !== "undefined") {
           const storedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
           
           // Normalize wishlist IDs: add prefixes if missing
           const normalizedWishlist = storedWishlist.map(id => {
             if (typeof id === 'string' && !id.includes('-')) {
               // Assuming unprefixed IDs are static products for migration
               return `static-${id}`;
             }
             return id;
           });
           setWishlist(normalizedWishlist);
           localStorage.setItem("wishlist", JSON.stringify(normalizedWishlist)); // Save normalized wishlist
    
           const fetchAllProducts = async () => {
             const adminProducts = JSON.parse(localStorage.getItem("adminProducts") || "[]");
             const prefixedStaticProducts = staticProducts.map(p => ({ ...p, id: `static-${p.id}` }));

             let fetchedApiProducts = [];
             try {
               const [mensResponse, womensResponse] = await Promise.all([
                 fetch("https://fakestoreapi.com/products/category/men's clothing"),
                 fetch("https://fakestoreapi.com/products/category/women's clothing")
               ]);
               const mensData = await mensResponse.json();
               const womensData = await womensResponse.json();
               
               const combinedData = [...mensData, ...womensData];

               fetchedApiProducts = combinedData.map(p => ({
                 id: `api-${p.id.toString()}`,
                 name: p.title,
                 price: p.price,
                 description: p.description,
                 category: p.category,
                 image: p.image,
                 rating: p.rating ? p.rating.rate : 0,
                 reviewCount: p.rating ? p.rating.count : 0,
                 brand: "FashionStore", // Changed brand
                 sizes: ["S", "M", "L", "XL"],
                 quantity: 100,
                 inStock: true,
               }));
             } catch (error) {
               console.error("Error fetching API products for wishlist:", error)
             }
             setProducts([...prefixedStaticProducts, ...adminProducts, ...fetchedApiProducts]);
           };
           fetchAllProducts();
        }
      }, []); // The empty dependency array ensures this runs once when the page loads

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id.toString()))

  return (
    <div className="min-h-screen bg-gray-50">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Wishlist</h1>
          <Link href="/shop" className="text-blue-600 font-semibold hover:underline">
            Back to Shop
          </Link>
        </div>
        {wishlistedProducts.length === 0 ? (
          <div className="text-center text-gray-500 py-16">
            <p>No items in your wishlist.</p>
            <Link href="/shop" className="text-blue-600 font-semibold hover:underline">
              Browse Products
            </Link>
          </div>
        ) : (
          <ProductList products={wishlistedProducts} />
        )}
      </main>
      <Footer />
    </div>
  )
}
