"use client"

import { useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { Calendar, User, ArrowRight, Search } from "lucide-react"

const blogPosts = [
	{
		id: "1",
		title: "The Ultimate Guide to Choosing the Perfect Running Shoes",
		excerpt:
			"Discover how to find the ideal running shoes for your foot type, gait, and running style. Our comprehensive guide covers everything you need to know.",
		content: "Full article content here...",
		author: "Sarah Johnson",
		date: "January 15, 2025",
		category: "Footwear",
		tags: ["Running", "Shoes", "Guide", "Health"],
		image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop",
		readTime: "8 min read",
		featured: true,
	},
	{
		id: "2",
		title: "Spring Fashion Trends 2025: What's Hot This Season",
		excerpt:
			"Stay ahead of the fashion curve with our roundup of the hottest spring trends for 2025. From colors to silhouettes, we've got you covered.",
		content: "Full article content here...",
		author: "Mike Chen",
		date: "January 12, 2025",
		category: "Fashion",
		tags: ["Trends", "Spring", "Fashion", "Style"],
		image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop",
		readTime: "6 min read",
		featured: false,
	},
	{
		id: "3",
		title: "Sustainable Fashion: Building an Eco-Friendly Wardrobe",
		excerpt:
			"Learn how to make more sustainable fashion choices and build a wardrobe that's both stylish and environmentally conscious.",
		content: "Full article content here...",
		author: "Emma Davis",
		date: "January 10, 2025",
		category: "Sustainability",
		tags: ["Sustainable", "Eco-friendly", "Wardrobe", "Environment"],
		image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2074&auto=format&fit=crop",
		readTime: "10 min read",
		featured: true,
	},
	{
		id: "4",
		title: "How to Style Your Sneakers for Any Occasion",
		excerpt:
			"Sneakers aren't just for the gym anymore. Discover creative ways to incorporate sneakers into your everyday outfits.",
		content: "Full article content here...",
		author: "Alex Rodriguez",
		date: "January 8, 2025",
		category: "Style",
		tags: ["Sneakers", "Styling", "Casual", "Fashion"],
		image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1887&auto=format&fit=crop",
		readTime: "5 min read",
		featured: false,
	},
	{
		id: "5",
		title: "The History of Streetwear: From Subculture to Mainstream",
		excerpt:
			"Explore the fascinating journey of streetwear from its underground roots to becoming a dominant force in fashion.",
		content: "Full article content here...",
		author: "Jordan Kim",
		date: "January 5, 2025",
		category: "Culture",
		tags: ["Streetwear", "History", "Culture", "Fashion"],
		image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop",
		readTime: "12 min read",
		featured: false,
	},
	{
		id: "6",
		title: "Caring for Your Leather Shoes: A Complete Guide",
		excerpt:
			"Keep your leather shoes looking their best with our comprehensive care guide. Learn proper cleaning, conditioning, and storage techniques.",
		content: "Full article content here...",
		author: "David Wilson",
		date: "January 3, 2025",
		category: "Care",
		tags: ["Leather", "Shoes", "Care", "Maintenance"],
		image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop",
		readTime: "7 min read",
		featured: false,
	},
]

const categories = [
	"All",
	"Footwear",
	"Fashion",
	"Style",
	"Sustainability",
	"Culture",
	"Care",
]

export default function BlogPage() {
	const [selectedCategory, setSelectedCategory] = useState("All")
	const [searchQuery, setSearchQuery] = useState("")

	const filteredPosts = blogPosts.filter((post) => {
		const matchesCategory =
			selectedCategory === "All" || post.category === selectedCategory
		const matchesSearch =
			post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
			post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
		return matchesCategory && matchesSearch
	})

	const featuredPosts = blogPosts.filter((post) => post.featured)

	return (
		<div className="min-h-screen bg-gray-50">
			<Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

			<main className="container mx-auto px-4 py-8">
				{/* Page Header */}
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-gray-800 mb-4">
						AMATAK Blog
					</h1>
					<p className="text-gray-600 text-lg max-w-2xl mx-auto">
						Stay updated with the latest fashion trends, style tips, and product
						insights from our experts.
					</p>
				</div>

				{/* Featured Posts */}
				{featuredPosts.length > 0 && (
					<section className="mb-16">
						<h2 className="text-2xl font-bold text-gray-800 mb-8">
							Featured Articles
						</h2>
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
							{featuredPosts.map((post) => (
								<article
									key={post.id}
									className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
								>
									<div className="relative h-64 overflow-hidden">
										<Image
											src={post.image || "/placeholder.svg"}
											alt={post.title}
											fill
											className="object-cover group-hover:scale-105 transition-transform duration-500"
										/>
										<div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
											Featured
										</div>
									</div>

									<div className="p-6">
										<div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
											<span className="flex items-center gap-1">
												<Calendar size={14} />
												{post.date}
											</span>
											<span className="flex items-center gap-1">
												<User size={14} />
												{post.author}
											</span>
											<span>{post.readTime}</span>
										</div>

										<h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
											{post.title}
										</h3>
										<p className="text-gray-600 mb-4">{post.excerpt}</p>

										<div className="flex items-center justify-between">
											<div className="flex flex-wrap gap-2">
												{post.tags.slice(0, 2).map((tag) => (
													<span
														key={tag}
														className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
													>
														{tag}
													</span>
												))}
											</div>
											<Link
												href={`/blog/${post.id}`}
												className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
											>
												Read More
												<ArrowRight size={16} />
											</Link>
										</div>
									</div>
								</article>
							))}
						</div>
					</section>
				)}

				{/* Search and Filter */}
				<div className="bg-white rounded-2xl p-6 shadow-md mb-8">
					<div className="flex flex-col md:flex-row gap-4">
						{/* Search */}
						<div className="flex-1 relative">
							<input
								type="search"
								placeholder="Search articles..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
							/>
							<Search
								size={20}
								className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
							/>
						</div>

						{/* Category Filter */}
						<div className="flex flex-wrap gap-2">
							{categories.map((category) => (
								<button
									key={category}
									onClick={() => setSelectedCategory(category)}
									className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
										selectedCategory === category
											? "bg-blue-600 text-white"
											: "bg-gray-100 text-gray-700 hover:bg-blue-100"
									}`}
								>
									{category}
								</button>
							))}
						</div>
					</div>
				</div>

				{/* Blog Posts Grid */}
				<section>
					<div className="flex justify-between items-center mb-8">
						<h2 className="text-2xl font-bold text-gray-800">
							{selectedCategory === "All"
								? "All Articles"
								: `${selectedCategory} Articles`}
						</h2>
						<p className="text-gray-600">
							{filteredPosts.length} articles found
						</p>
					</div>

					{filteredPosts.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							{filteredPosts.map((post) => (
								<article
									key={post.id}
									className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
								>
									<div className="relative h-48 overflow-hidden">
										<Image
											src={post.image || "/placeholder.svg"}
											alt={post.title}
											fill
											className="object-cover group-hover:scale-105 transition-transform duration-500"
										/>
										<div className="absolute top-4 left-4 bg-white bg-opacity-90 px-2 py-1 rounded-full text-xs font-semibold">
											{post.category}
										</div>
									</div>

									<div className="p-6">
										<div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
											<span className="flex items-center gap-1">
												<Calendar size={14} />
												{post.date}
											</span>
											<span>{post.readTime}</span>
										</div>

										<h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
											{post.title}
										</h3>
										<p className="text-gray-600 mb-4 line-clamp-3">
											{post.excerpt}
										</p>

										<div className="flex items-center justify-between">
											<span className="text-sm text-gray-500 flex items-center gap-1">
												<User size={14} />
												{post.author}
											</span>
											<Link
												href={`/blog/${post.id}`}
												className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
											>
												Read More
												<ArrowRight size={16} />
											</Link>
										</div>
									</div>
								</article>
							))}
						</div>
					) : (
						<div className="text-center py-12">
							<p className="text-gray-500 text-lg">
								No articles found matching your criteria.
							</p>
							<button
								onClick={() => {
									setSelectedCategory("All")
									setSearchQuery("")
								}}
								className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
							>
								Clear Filters
							</button>
						</div>
					)}
				</section>

				{/* Newsletter Signup */}
				<section className="mt-16 bg-blue-600 rounded-2xl p-8 text-center text-white">
					<h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
					<p className="mb-6 max-w-2xl mx-auto">
						Subscribe to our newsletter to get the latest fashion tips, product
						updates, and exclusive offers delivered
						to your inbox.
					</p>
					<form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
						<input
							type="email"
							placeholder="Enter your email"
							className="flex-1 px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
						/>
						<button
							type="submit"
							className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
						>
							Subscribe
						</button>
					</form>
				</section>
			</main>

			<Footer />
		</div>
	)
}
