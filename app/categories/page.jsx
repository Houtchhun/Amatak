"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Grid, List, Edit, Trash2 } from "lucide-react"
import { useAuth } from "@/lib/AuthContext"

export default function CategoriesPage() {
  const [viewMode, setViewMode] = useState("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [categories, setCategories] = useState([]);
  const [allApiProducts, setAllApiProducts] = useState([]); // Store all products from API
  const [newCategory, setNewCategory] = useState({
    id: "",
    name: "",
    description: "",
    image: "",
    apiKeyword: "",
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const auth = useAuth(); // Get the entire object from useAuth
  const user = auth ? auth.user : null; // Safely get user, default to null
  const [isAdmin, setIsAdmin] = useState(false);

  // Check admin status
  useEffect(() => {
    setIsAdmin(user && user.role === "admin");
  }, [user]);

  // Fetch products and populate categories
  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        const [mensResponse, womensResponse] = await Promise.all([
          fetch("https://fakestoreapi.com/products/category/men's clothing"),
          fetch("https://fakestoreapi.com/products/category/women's clothing"),
        ]);
        const mensData = await mensResponse.json();
        const womensData = await womensResponse.json();
        const combinedData = [...mensData, ...womensData];
        setAllApiProducts(combinedData);

        const uniqueCategories = {};
        combinedData.forEach((product) => {
          if (product.category) {
            if (!uniqueCategories[product.category]) {
              uniqueCategories[product.category] = {
                id: product.category,
                name: product.category.charAt(0).toUpperCase() + product.category.slice(1),
                description: `Products in the ${product.category} category.`, // Placeholder description
                image: product.image || "/placeholder.svg", // Use product image as category image
                apiKeyword: product.category,
                productCount: 0,
              };
            }
            uniqueCategories[product.category].productCount++;
          }
        });

        // Add default categories if no API products are found or for initial load
        if (Object.keys(uniqueCategories).length === 0) {
          setCategories([
            { id: "all", name: "All", description: "All products", image: "/placeholder.svg", apiKeyword: "all", productCount: 0 },
            { id: "men's clothing", name: "Men's Clothing", description: "Apparel for men", image: "/placeholder.svg", apiKeyword: "men's clothing", productCount: 0 },
            { id: "women's clothing", name: "Women's Clothing", description: "Apparel for women", image: "/placeholder.svg", apiKeyword: "women's clothing", productCount: 0 },
          ]);
        } else {
          setCategories(Object.values(uniqueCategories));
        }
      } catch (error) {
        console.error("Error fetching products or categories:", error);
        // Fallback to default categories on error
        setCategories([
          { id: "all", name: "All", description: "All products", image: "/placeholder.svg", apiKeyword: "all", productCount: 0 },
          { id: "men's clothing", name: "Men's Clothing", description: "Apparel for men", image: "/placeholder.svg", apiKeyword: "men's clothing", productCount: 0 },
          { id: "women's clothing", name: "Women's Clothing", description: "Apparel for women", image: "/placeholder.svg", apiKeyword: "women's clothing", productCount: 0 },
        ]);
      }
    };
    fetchProductsAndCategories();
  }, []);

  // Placeholder functions for admin actions
  const handleAddCategory = (e) => {
    e.preventDefault();
    console.log("Add category:", newCategory);
    // In a real app, you'd send this to a backend or update localStorage
    setCategories((prev) => [...prev, { ...newCategory, id: Date.now().toString(), productCount: 0 }]);
    setNewCategory({ id: "", name: "", description: "", image: "", apiKeyword: "" });
  };

  const handleEditCategory = (e) => {
    e.preventDefault();
    console.log("Save edited category:", editingCategory);
    // In a real app, you'd send this to a backend or update localStorage
    setCategories((prev) =>
      prev.map((cat) => (cat.id === editingCategory.id ? editingCategory : cat))
    );
    setEditingCategory(null);
  };

  const handleDeleteCategory = (id) => {
    console.log("Delete category:", id);
    // In a real app, you'd send this to a backend or update localStorage
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <main className="container mx-auto px-4 py-8">
        {isAdmin && (
          <div className="bg-white rounded-2xl p-6 shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {editingCategory ? "Edit Category" : "Add New Category"}
            </h2>
            <form onSubmit={editingCategory ? handleEditCategory : handleAddCategory} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Category Name"
                value={editingCategory ? editingCategory.name : newCategory.name}
                onChange={(e) =>
                  editingCategory
                    ? setEditingCategory({ ...editingCategory, name: e.target.value })
                    : setNewCategory({ ...newCategory, name: e.target.value })
                }
                className="border px-3 py-2 rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="API Keyword (e.g., men's clothing)"
                value={editingCategory ? editingCategory.apiKeyword : newCategory.apiKeyword}
                onChange={(e) =>
                  editingCategory
                    ? setEditingCategory({ ...editingCategory, apiKeyword: e.target.value })
                    : setNewCategory({ ...newCategory, apiKeyword: e.target.value })
                }
                className="border px-3 py-2 rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Image URL"
                value={editingCategory ? editingCategory.image : newCategory.image}
                onChange={(e) =>
                  editingCategory
                    ? setEditingCategory({ ...editingCategory, image: e.target.value })
                    : setNewCategory({ ...newCategory, image: e.target.value })
                }
                className="border px-3 py-2 rounded-lg"
              />
              <textarea
                placeholder="Description"
                value={editingCategory ? editingCategory.description : newCategory.description}
                onChange={(e) =>
                  editingCategory
                    ? setEditingCategory({ ...editingCategory, description: e.target.value })
                    : setNewCategory({ ...newCategory, description: e.target.value })
                }
                className="border px-3 py-2 rounded-lg md:col-span-2"
              />
              <div className="md:col-span-2 flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex-1"
                >
                  {editingCategory ? "Save Changes" : "Add Category"}
                </button>
                {editingCategory && (
                  <button
                    type="button"
                    onClick={() => setEditingCategory(null)}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Shop by Category</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover our wide range of products organized by category. Find exactly what you're looking for.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-gray-600">{filteredCategories.length} categories available</p>
          </div>
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-white text-gray-600"}`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-white text-gray-600"}`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {/* Categories Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className="relative h-64 overflow-hidden">
                  {" "}
                  {/* Increased height */}
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300" />
                  <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-2 py-1 rounded-full text-sm font-semibold">
                    {category.productCount} items
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{category.name}</h3>
                    {isAdmin && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingCategory(category)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit Category"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete Category"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Product Count: {category.productCount}</p>
                  </div>
                  <Link
                    href={`/shop?category=${category.id}`}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    Shop {category.name}
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-8"
              >
                <div className="flex gap-6">
                  <div className="w-48 h-48 flex-shrink-0 rounded-lg overflow-hidden">
                    {" "}
                    {/* Increased width/height */}
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      width={192} // Corresponds to w-48
                      height={192} // Corresponds to h-48
                      className="object-cover w-full h-full"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-2xl font-bold text-gray-800">{category.name}</h3>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {category.productCount} items
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4">{category.description}</p>

                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Product Count: {category.productCount}</p>
                    </div>

                    <div className="flex gap-2 items-center">
                      <Link
                        href={`/shop?category=${category.id}`}
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Shop {category.name}
                        <ArrowRight size={16} />
                      </Link>
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => setEditingCategory(category)}
                            className="text-blue-600 hover:text-blue-800 p-2"
                            title="Edit Category"
                          >
                            <Edit size={20} />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="text-red-600 hover:text-red-800 p-2"
                            title="Delete Category"
                          >
                            <Trash2 size={20} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        
      </main>

      <Footer />
    </div>
  )
}
    
