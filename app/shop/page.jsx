"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useParams, useRouter } from "next/navigation"
import ProductList from "@/components/product-list"
import Filter from "@/components/filter"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import Image from "next/image"
import Star from "@/components/icons/star"
import { addToCart } from "@/lib/cart"
import { useAuth } from "@/lib/AuthContext"
import { allProducts as staticProducts } from "@/data/products"



const ShopPage = () => {
  const searchParams = useSearchParams()
  const initialCategoryParam = searchParams.get("category") || "all"

  const [selectedCategory, setSelectedCategory] = useState(initialCategoryParam)
  const [selectedBrand, setSelectedBrand] = useState("All")
  const [priceRange, setPriceRange] = useState(500) // Max price for filter

  const [appliedCategory, setAppliedCategory] = useState(initialCategoryParam)
  const [appliedBrand, setAppliedBrand] = useState("All")
  const [appliedPriceRange, setAppliedPriceRange] = useState(500)

  const [adminProducts, setAdminProducts] = useState([])
  const [apiProducts, setApiProducts] = useState([])
  const [allCategoriesData, setAllCategoriesData] = useState([]);

  // Load categories from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCategories = localStorage.getItem("customCategories");
      if (storedCategories) {
        setAllCategoriesData(JSON.parse(storedCategories));
      } else {
        // Fallback to default if no custom categories are set
        setAllCategoriesData([
          { id: "all", name: "All" },
          { id: "men's clothing", name: "Men's Clothing" },
          { id: "women's clothing", name: "Women's Clothing" },
        ]);
      }
    }
  }, []);

  // Load adminProducts from localStorage on mount and window focus
  const loadAdminProducts = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("adminProducts")
      console.log("Raw stored adminProducts:", stored);
      if (stored) {
        try {
          setAdminProducts(JSON.parse(stored))
          console.log("Admin Products loaded:", JSON.parse(stored));
        } catch {
          setAdminProducts([])
        }
      } else {
        setAdminProducts([])
      }
    }
  }

  useEffect(() => {
    loadAdminProducts()
    const onFocus = () => loadAdminProducts()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [])


  

  // Only update adminProducts in localStorage when changed
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("adminProducts", JSON.stringify(adminProducts))
    }
  }, [adminProducts])

  const normalizedAdminProducts = adminProducts.map((prod) => ({
    ...prod,
    category: typeof prod.category === "string" ? prod.category : "Admin",
    brand: typeof prod.brand === "string" ? prod.brand : "Admin",
    rating: typeof prod.rating === "number" ? prod.rating : 5,
    reviewCount: typeof prod.reviewCount === "number" ? prod.reviewCount : 0,
    price: typeof prod.price === "number" ? prod.price : 0,
    name: typeof prod.name === "string" ? prod.name : "",
    image: typeof prod.image === "string" ? prod.image : "/placeholder.svg",
    sizes: Array.isArray(prod.sizes) && prod.sizes.length > 0 ? prod.sizes : ["M"],
    description: typeof prod.description === "string" ? prod.description : "",
    quantity: typeof prod.quantity === "number" ? prod.quantity : (prod.quantity !== undefined ? Number(prod.quantity) : 1),
    // FIXED: Only add admin- prefix if the ID doesn't already have a prefix
    id: prod.id.toString().startsWith('api-') 
      ? prod.id.toString() // Keep original ID for API products
      : `admin-${prod.id}`, // Add admin- prefix only for manually added products
  }))


  
    const allProducts = normalizedAdminProducts;

    useEffect(() => {
      const fetchAndStoreProducts = async () => {
        // Check if we already have API products in localStorage
        const stored = localStorage.getItem("adminProducts");
        if (stored) {
          const parsedProducts = JSON.parse(stored);
          const hasApiProducts = parsedProducts.some(p => p.id.startsWith('api-'));
          if (hasApiProducts) {
            console.log("API products already in localStorage, skipping fetch");
            return; // Skip fetching if API products already exist
          }
        }

        try {
          const [mensResponse, womensResponse] = await Promise.all([
            fetch("https://fakestoreapi.com/products/category/men's clothing"),
            fetch("https://fakestoreapi.com/products/category/women's clothing")
          ]);
          
          if (!mensResponse.ok || !womensResponse.ok) {
            throw new Error('Failed to fetch products');
          }
          
          const mensData = await mensResponse.json();
          const womensData = await womensResponse.json();
          const combinedData = [...mensData, ...womensData];

          const normalized = combinedData.map(p => ({
            id: p.id,
            name: p.title,
            price: p.price,
            description: p.description,
            category: p.category,
            image: p.image,
            rating: p.rating ? p.rating.rate : 0,
            reviewCount: p.rating ? p.rating.count : 0,
            brand: "FashionStore",
            sizes: ["S", "M", "L", "XL"],
            quantity: 100,
            inStock: true,
            originalPrice: p.price,
            badge: null,
            colors: [],
          }));
          
          setAdminProducts(prevProducts => [...prevProducts, ...normalized]);
          
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      };

      fetchAndStoreProducts();
    }, [])



  // Extract unique brands from all products
  const uniqueBrands = new Set();
  allProducts.forEach(product => {
    if (product.brand && typeof product.brand === 'string') {
      uniqueBrands.add(product.brand);
    }
  });
  const brands = ["All", ...Array.from(uniqueBrands).sort()];

  // For product detail view (if accessed directly via /product/[id])
  const params = useParams()
  const productId = params.id;
  const product = allProducts.find((p) => p.id.endsWith(productId) || p.id === productId)

  // State for product detail view specific selections
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColorIndex, setSelectedColorIndex] = useState(0) // Use index for color
  const [selectedSize, setSelectedSize] = useState("")
  const [quantity, setQuantity] = useState(1)

  // Add searchQuery state for Header
  const [searchQuery, setSearchQuery] = useState("")

  const router = useRouter()
  const { user } = useAuth()
  
  // Safe variable declarations to prevent reference errors
  const safeAppliedCategory = typeof appliedCategory === "string" ? appliedCategory : "all"
  const safeAppliedBrand = typeof appliedBrand === "string" ? appliedBrand : "All"
  const safeSelectedCategory = typeof selectedCategory === "string" ? selectedCategory : "all"
  const safeSelectedBrand = typeof selectedBrand === "string" ? selectedBrand : "All"

  // Filter handler functions
  const handleApplyFilters = () => {
    setAppliedCategory(selectedCategory)
    setAppliedBrand(selectedBrand)
    setAppliedPriceRange(priceRange)
  }

  const handleResetFilters = () => {
    setSelectedCategory("all")
    setSelectedBrand("All")
    setPriceRange(500)
    setAppliedCategory("all")
    setAppliedBrand("All")
    setAppliedPriceRange(500)
  }

  const onPriceRangeChange = (value) => {
    setPriceRange(value);
  };

  // Filtering logic
  const filteredProducts = allProducts.filter((product) => {
    const prodCategory = typeof product.category === "string" ? product.category : ""
    const prodBrand = typeof product.brand === "string" ? product.brand : ""

    const selectedCategoryObject = allCategoriesData.find(cat => cat.id === safeAppliedCategory);
    const categoryApiKeyword = selectedCategoryObject ? selectedCategoryObject.apiKeyword : safeAppliedCategory; // Use apiKeyword for filtering

    const categoryMatch =
      safeAppliedCategory === "all" ||
      (typeof prodCategory === "string" && prodCategory.toLowerCase() === categoryApiKeyword.toLowerCase())

    const brandMatch = safeAppliedBrand === "All" || prodBrand === safeAppliedBrand

    const priceMatch = product.price <= appliedPriceRange

    const search =
      searchQuery.trim().length === 0 ||
      (typeof product.name === "string" && product.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (typeof prodBrand === "string" && prodBrand.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (typeof product.description === "string" && product.description.toLowerCase().includes(searchQuery.toLowerCase()))

    return categoryMatch && brandMatch && priceMatch && search
  })

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

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      alert("Please select a size")
      return
    }
    const image =
      (product.colors && product.colors[selectedColorIndex]?.image) ||
      (product.images && product.images[selectedImage]) ||
      product.image ||
      "/placeholder.svg"

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image,
      color: (product.colors && product.colors[selectedColorIndex]?.name) || "default",
      size: selectedSize || "default",
      inStock: product.inStock,
    })
    // Redirect to cart page after adding
    router.push("/cart")
  }

  // Wishlist logic
  const [isWishlisted, setIsWishlisted] = useState(false)
  useEffect(() => {
    if (product && typeof window !== "undefined") {
      // The wishlist is stored in localStorage as a JSON array of product IDs
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
      setIsWishlisted(wishlist.includes(product.id))
    }
  }, [product])

  const handleWishlistToggle = () => {
    if (!product) return
    // The wishlist is stored in localStorage under the key "wishlist"
    let wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
    if (isWishlisted) {
      wishlist = wishlist.filter((id) => id !== product.id)
    } else {
      wishlist.push(product.id)
    }
    localStorage.setItem("wishlist", JSON.stringify(wishlist))
    setIsWishlisted(!isWishlisted)
  }

  // Defensive: ensure product.sizes is always an array for product detail view
  const safeProductSizes = (product && Array.isArray(product.sizes) && product.sizes.length > 0)
    ? product.sizes
    : ["M"]

  // If product ID is present in params, render product detail page
  if (productId && product) {
    const currentProduct = product; // Already found from allProducts

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
              <span className="text-gray-800">{product.name}</span>
            </div>
              <div className="flex items-center space-x-4">
                <label htmlFor="quantity" className="text-gray-800 font-medium">Quantity:</label>
                <button
                  type="button"
                  className="px-2 py-1 bg-gray-200 rounded"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >-</button>
                <input
                  id="quantity"
                  type="number"
                  min={1}
                  max={currentProduct.quantity || 1}
                  value={quantity}
                  onChange={e => {
                    let val = Number(e.target.value)
                    if (isNaN(val) || val < 1) val = 1
                    if (val > (currentProduct.quantity || 1)) val = currentProduct.quantity || 1
                    setQuantity(val)
                  }}
                  className="w-16 text-center border border-gray-300 rounded px-2 py-1"
                />
                <button
                  type="button"
                  className="px-2 py-1 bg-gray-200 rounded"
                  onClick={() => setQuantity(q => Math.min((currentProduct.quantity || 1), q + 1))}
                  disabled={quantity >= (currentProduct.quantity || 1)}
                >+</button>
                <span className="text-gray-500 text-sm">(In stock: {currentProduct.quantity || 0})</span>
              </div>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-md">
                <Image
                  src={
                    (product.colors && product.colors[selectedColorIndex]?.image) ||
                    (product.images && product.images[0]) ||
                    product.image ||
                    "/placeholder.svg"
                  }
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {product.badge && (
                  <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {product.badge}
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              <div className="flex space-x-2 overflow-x-auto">
                {product.colors && product.colors.length > 0
                  ? product.colors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedColorIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                          selectedColorIndex === index ? "border-blue-600" : "border-gray-200"
                        }`}
                      >
                        <Image
                          src={color.image || "/placeholder.svg"}
                          alt={`${product.name} - ${color.name}`}
                          width={80}
                          height={80}
                          className="object-cover w-full h-full"
                        />
                      </button>
                    ))
                  : product.images?.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                          selectedImage === index ? "border-blue-600" : "border-gray-200"
                        }`}
                      >
                        <Image
                          src={img || "/placeholder.svg"}
                          alt={`${product.name} - Image ${index + 1}`}
                          width={80}
                          height={80}
                          className="object-cover w-full h-full"
                        />
                      </button>
                    ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <p className="text-blue-600 font-medium mb-2">{product.brand}</p>
                <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              </div>
              <div className="flex items-center space-x-2">
                {renderStars(product.rating)}
                <p className="text-gray-600 text-sm">({product.reviewCount} reviews)</p>
              </div>
              <div className="flex items-center space-x-4">
                <p className="text-2xl font-bold">$${product.price.toFixed(2)}</p>
                {product.originalPrice && (
                  <p className="text-gray-500 line-through">$${product.originalPrice.toFixed(2)}</p>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <p className="text-gray-800 font-medium">Size:</p>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1"
                >
                  {safeProductSizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleAddToCart}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleWishlistToggle}
                  className={`px-4 py-2 rounded flex items-center gap-2 ${
                    isWishlisted ? "bg-red-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                  aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill={isWishlisted ? "currentColor" : "none"}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
                    />
                  </svg>
                  {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Error boundary for Filter
  let filterError = null;
  let filterComponent = null;
  try {
    // Ensure allCategoriesData is an array before passing it
    const categoriesToPass = Array.isArray(allCategoriesData) ? allCategoriesData : [];

    filterComponent = (
      <Filter
        allCategoriesData={categoriesToPass}
        brands={brands}
        selectedCategory={safeSelectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedBrand={safeSelectedBrand}
        onBrandChange={setSelectedBrand}
        priceRange={priceRange}
        onPriceRangeChange={onPriceRangeChange}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />
    );
  } catch (err) {
    console.error("Error rendering Filter component:", err); // Log the actual error
    filterError = err;
  }

  // Add product form state
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    brand: "",
    category: "",
    image: "",
    description: "",
    quantity: 1,
    discount: "",
  })

  // Product edit state
  const [editProductId, setEditProductId] = useState(null)
  const [editFields, setEditFields] = useState({
    name: "",
    price: "",
    brand: "",
    category: "",
    image: "",
    description: "",
    quantity: 1,
    discount: "",
  })
  const [showEditCanvas, setShowEditCanvas] = useState(false)

  // Filter management state (admin only)
  const [editFilter, setEditFilter] = useState(null)
  const [editFilterFields, setEditFilterFields] = useState({ name: "", subcategories: "" })

  // Add product handler
  const handleAddProduct = (e) => {
    e.preventDefault()
    if (!newProduct.name || !newProduct.price || !newProduct.category || !newProduct.quantity) {
      alert("Name, price, category, and quantity are required.")
      return
    }
    const originalPrice = Number(newProduct.price)
    let price = originalPrice
    const discount = Number(newProduct.discount)
    if (discount > 0 && discount < 100) {
      price = Number((originalPrice * (1 - discount / 100)).toFixed(2))
    }
    const productToAdd = {
      ...newProduct,
      id: Date.now().toString(),
      price,
      originalPrice,
      brand: newProduct.brand || "Other",
      category: newProduct.category,
      image: newProduct.image || "/placeholder.svg",
      description: newProduct.description || "",
      rating: 5,
      reviewCount: 0,
      sizes: ["M"],
      inStock: true,
      quantity: Number(newProduct.quantity),
    }
    // Add to state and localStorage immediately, then reload
    setAdminProducts((prev) => [...prev, productToAdd]);
    setShowAddProduct(false);
    setNewProduct({
      name: "",
      price: "",
      brand: "",
      category: "",
      subcategory: "",
      image: "",
      description: "",
      quantity: 1,
      discount: "",
    });
  }

  // Edit product handlers
  const handleEditProduct = (product) => {
    setEditProductId(product.id)
    setEditFields({
      name: product.name,
      price: product.originalPrice?.toString() || product.price.toString(),
      brand: product.brand || "",
      category: product.category || "",
      image: product.image || "",
      description: product.description || "",
      quantity: product.quantity ?? 1,
      discount: product.originalPrice && product.price && product.originalPrice !== product.price
        ? Math.round((1 - product.price / product.originalPrice) * 100).toString()
        : "",
    })
    setShowEditCanvas(true)
  }
  const handleSaveEditProduct = () => {
    const discount = Number(editFields.discount)
    const originalPrice = Number(editFields.price)
    let price = originalPrice
    if (discount > 0 && discount < 100) {
      price = Number((originalPrice * (1 - discount / 100)).toFixed(2))
    }
    const updated = adminProducts.map((p) =>
      p.id === editProductId
        ? {
            ...p,
            name: editFields.name,
            price,
            originalPrice,
            brand: editFields.brand,
            category: editFields.category,
            image: editFields.image,
            description: editFields.description,
            quantity: Number(editFields.quantity),
          }
        : p
    )
    setAdminProducts(updated)
    localStorage.setItem("adminProducts", JSON.stringify(updated))
    setEditProductId(null)
    setEditFields({
      name: "",
      price: "",
      brand: "",
      category: "",
      subcategory: "",
      image: "",
      description: "",
      quantity: 1,
      discount: "",
    })
    setShowEditCanvas(false)
  }
  const handleCancelEditProduct = () => {
    setEditProductId(null)
    setEditFields({
      name: "",
      price: "",
      brand: "",
      category: "",
      subcategory: "",
      image: "",
      description: "",
      quantity: 1,
      discount: "",
    })
    setShowEditCanvas(false)
  }
  const handleDeleteProduct = (id) => {
    const updated = adminProducts.filter((p) => p.id !== id);
    setAdminProducts(updated);
  }

  const [isAdmin, setIsAdmin] = useState(false)
  useEffect(() => {
    setIsAdmin(user?.role === "admin")
  }, [user])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between mb-8">
          <h1 className="text-3xl font-bold">Shop</h1>
          <div className="flex gap-2">
            
            <button
              onClick={handleResetFilters}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Admin Product Management Panel: Add/Edit Product (for admin only) */}
        {isAdmin && (
          <div className="mb-8 bg-white rounded-2xl p-6 shadow-md">
            <h2 className="text-xl font-bold mb-4">Product Management</h2>
            {/* Add Product Form */}
            {showAddProduct && (
              <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <input className="border px-3 py-2 rounded" placeholder="Name" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} required />
                <input type="number" className="border px-3 py-2 rounded" placeholder="Price" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} required />
                <input className="border px-3 py-2 rounded" placeholder="Brand" value={newProduct.brand} onChange={e => setNewProduct({ ...newProduct, brand: e.target.value })} />
                <input className="border px-3 py-2 rounded" placeholder="Category" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} required />
                <input className="border px-3 py-2 rounded" placeholder="Subcategory" value={newProduct.subcategory} onChange={e => setNewProduct({ ...newProduct, subcategory: e.target.value })} />
                <input className="border px-3 py-2 rounded" placeholder="Image URL" value={newProduct.image} onChange={e => setNewProduct({ ...newProduct, image: e.target.value })} />
                <input type="number" className="border px-3 py-2 rounded" placeholder="Quantity" value={newProduct.quantity} min={1} onChange={e => setNewProduct({ ...newProduct, quantity: Number(e.target.value) })} required />
                <input type="number" className="border px-3 py-2 rounded" placeholder="Discount (%)" value={newProduct.discount} min={0} max={90} onChange={e => setNewProduct({ ...newProduct, discount: e.target.value })} />
                <textarea className="border px-3 py-2 rounded md:col-span-2" placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
                <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 md:col-span-2">Add Product</button>
              </form>
            )}
            <button
              onClick={() => setShowAddProduct((v) => !v)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4"
            >
              {showAddProduct ? "Cancel" : "Add Product"}
            </button>
            {/* Product List for Admin */}
            <div className="overflow-x-auto">
              <table className="w-full border mb-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th>Name</th>
                    <th>Price</th>
                    <th>Brand</th>
                    <th>Category</th>
                    <th>Discount (%)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
  // Remove duplicates from adminProducts before rendering
                    const uniqueAdminProducts = adminProducts.filter((product, index, self) => 
                      index === self.findIndex(p => p.id === product.id)
                    );
                    
                    return uniqueAdminProducts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-4 text-gray-500 text-center">No products found.</td>
                      </tr>
                    ) : (
                      uniqueAdminProducts.map((product) => (
                        <tr key={product.id}>
                          <td className="py-2 px-2">{product.name}</td>
                          <td className="py-2 px-2">${product.price.toFixed(2)}</td>
                          <td className="py-2 px-2">{product.brand}</td>
                          <td className="py-2 px-2">{product.category}</td>
                          <td className="py-2 px-2">{product.originalPrice && product.price && product.originalPrice !== product.price ? Math.round((1 - product.price / product.originalPrice) * 100) : 0}</td>
                          <td className="py-2 px-2 flex gap-2 justify-center">
                            <button onClick={() => handleEditProduct(product)} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Edit</button>
                            <button onClick={() => handleDeleteProduct(product.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Delete</button>
                          </td>
                        </tr>
                      ))
                    );
                  })()}

                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Edit Canvas for Product (admin only) */}
        {showEditCanvas && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Edit Product</h3>
              <form
                onSubmit={e => {
                  e.preventDefault()
                  handleSaveEditProduct()
                }}
                className="space-y-4"
              >
                <input className="w-full border px-3 py-2 rounded" placeholder="Name" value={editFields.name} onChange={e => setEditFields({ ...editFields, name: e.target.value })} required />
                <input type="number" className="w-full border px-3 py-2 rounded" placeholder="Price" value={editFields.price} onChange={e => setEditFields({ ...editFields, price: e.target.value })} required />
                <input className="w-full border px-3 py-2 rounded" placeholder="Brand" value={editFields.brand} onChange={e => setEditFields({ ...editFields, brand: e.target.value })} />
                <input className="w-full border px-3 py-2 rounded" placeholder="Category" value={editFields.category} onChange={e => setEditFields({ ...editFields, category: e.target.value })} required />
                <input className="w-full border px-3 py-2 rounded" placeholder="Subcategory" value={editFields.subcategory} onChange={e => setEditFields({ ...editFields, subcategory: e.target.value })} />
                <input className="w-full border px-3 py-2 rounded" placeholder="Image URL" value={editFields.image} onChange={e => setEditFields({ ...editFields, image: e.target.value })} />
                <input type="number" className="w-full border px-3 py-2 rounded" placeholder="Quantity" value={editFields.quantity} min={1} onChange={e => setEditFields({ ...editFields, quantity: e.target.value })} required />
                <input type="number" className="w-full border px-3 py-2 rounded" placeholder="Discount (%)" value={editFields.discount} min={0} max={90} onChange={e => setEditFields({ ...editFields, discount: e.target.value })} />
                <textarea className="w-full border px-3 py-2 rounded" placeholder="Description" value={editFields.description} onChange={e => setEditFields({ ...editFields, description: e.target.value })} />
                <div className="flex gap-2 justify-end">
                  <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Save</button>
                  <button type="button" onClick={handleCancelEditProduct} className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Filters Sidebar and Product List */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-md mb-8">
              <h2 className="text-xl font-bold mb-4">Filters</h2>
              {filterError ? (
                <div className="text-red-500 text-sm">
                  Error loading filters. Please refresh the page.
                </div>
              ) : (
                filterComponent
              )}
            </div>
          </div>
          <div className="md:col-span-3">
            <ProductList products={filteredProducts} showQuantity />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
};

export default ShopPage;