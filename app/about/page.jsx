"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { Award, Users, Globe, Heart, Star, ArrowRight } from "lucide-react"
import { useState } from "react"

const teamMembers = [
	{
		name: "Sarah Johnson",
		role: "Founder & CEO",
		image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=1887&auto=format&fit=crop",
		bio: "Fashion enthusiast with 15+ years in retail and e-commerce.",
	},
	{
		name: "Mike Chen",
		role: "Head of Design",
		image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop",
		bio: "Creative director passionate about sustainable fashion design.",
	},
	{
		name: "Emma Davis",
		role: "Marketing Director",
		image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop",
		bio: "Digital marketing expert focused on brand storytelling.",
	},
	{
		name: "Alex Rodriguez",
		role: "Operations Manager",
		image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop",
		bio: "Supply chain specialist ensuring quality and efficiency.",
	},
]

const stats = [
	{ number: "50K+", label: "Happy Customers" },
	{ number: "1000+", label: "Products" },
	{ number: "25+", label: "Countries" },
	{ number: "5", label: "Years Experience" },
]

const values = [
	{
		icon: <Award className="w-8 h-8 text-blue-600" />,
		title: "Quality First",
		description:
			"We source only the finest materials and work with trusted manufacturers to ensure every product meets our high standards.",
	},
	{
		icon: <Users className="w-8 h-8 text-blue-600" />,
		title: "Customer Focused",
		description:
			"Our customers are at the heart of everything we do. We listen, adapt, and continuously improve based on your feedback.",
	},
	{
		icon: <Globe className="w-8 h-8 text-blue-600" />,
		title: "Sustainability",
		description:
			"We're committed to reducing our environmental impact through sustainable practices and eco-friendly products.",
	},
	{
		icon: <Heart className="w-8 h-8 text-blue-600" />,
		title: "Community",
		description:
			"We believe in giving back to our community and supporting causes that matter to our customers and team.",
	},
]

const testimonials = [
	{
		name: "Jessica Wong",
		role: "Fashion Blogger",
		content:
			"AMATAK has become my go-to store for quality fashion pieces. Their attention to detail and customer service is unmatched.",
		rating: 5,
	},
	{
		name: "David Miller",
		role: "Regular Customer",
		content:
			"I've been shopping with AMATAK for 3 years now. The quality is consistent and the styles are always on-trend.",
		rating: 5,
	},
	{
		name: "Maria Garcia",
		role: "Style Enthusiast",
		content: "Love the sustainable fashion options and the fast shipping. AMATAK makes it easy to shop responsibly.",
		rating: 5,
	},
]

export default function AboutPage() {
	const [searchQuery, setSearchQuery] = useState("")

	return (
		<div className="min-h-screen bg-gray-50">
			<Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

			<main>
				{/* Hero Section */}
				<section className="relative h-96 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white">
					<div className="text-center max-w-4xl mx-auto px-4">
						<h1 className="text-5xl font-bold mb-6">About AMATAK</h1>
						<p className="text-xl leading-relaxed">
							We're passionate about bringing you the latest fashion trends with uncompromising quality and exceptional
							service.
						</p>
					</div>
				</section>

				{/* Our Story */}
				<section className="py-16 bg-white">
					<div className="container mx-auto px-4">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
							<div>
								<h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
								<div className="space-y-4 text-gray-600 leading-relaxed">
									<p>
										Founded in 2020, AMATAK began as a small online boutique with a simple mission: to make
										high-quality, stylish fashion accessible to everyone. What started as a passion project in a small
										apartment has grown into a trusted brand serving customers worldwide.
									</p>
									<p>
										Our founder, Sarah Johnson, noticed a gap in the market for affordable yet premium fashion pieces.
										With her background in fashion retail and a keen eye for trends, she set out to create a brand that
										would bridge the gap between fast fashion and luxury.
									</p>
									<p>
										Today, AMATAK is proud to offer a curated selection of clothing, shoes, and accessories that combine
										contemporary style with timeless appeal. We work directly with manufacturers to ensure fair pricing
											while maintaining the highest quality standards.
									</p>
								</div>
							</div>
							<div className="relative h-96 rounded-2xl overflow-hidden">
								<Image
									src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"
									alt="Our Story"
									fill
									className="object-cover"
								/>
							</div>
						</div>
					</div>
				</section>

				{/* Stats */}
				<section className="py-16 bg-gray-50">
					<div className="container mx-auto px-4">
						<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
							{stats.map((stat, index) => (
								<div key={index} className="text-center">
									<div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
									<div className="text-gray-600">{stat.label}</div>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Our Values */}
				<section className="py-16 bg-white">
					<div className="container mx-auto px-4">
						<div className="text-center mb-12">
							<h2 className="text-3xl font-bold text-gray-800 mb-4">Our Values</h2>
							<p className="text-gray-600 max-w-2xl mx-auto">
								These core values guide everything we do and shape the way we interact with our customers, partners, and
								community.
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
							{values.map((value, index) => (
								<div key={index} className="text-center p-6 rounded-2xl hover:shadow-lg transition-shadow duration-300">
									<div className="flex justify-center mb-4">{value.icon}</div>
									<h3 className="text-xl font-semibold text-gray-800 mb-3">{value.title}</h3>
									<p className="text-gray-600">{value.description}</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Team */}
				<section className="py-16 bg-gray-50">
					<div className="container mx-auto px-4">
						<div className="text-center mb-12">
							<h2 className="text-3xl font-bold text-gray-800 mb-4">Meet Our Team</h2>
							<p className="text-gray-600 max-w-2xl mx-auto">
								Behind AMATAK is a passionate team of fashion enthusiasts, designers, and customer service experts
								dedicated to bringing you the best shopping experience.
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
							{teamMembers.map((member, index) => (
								<div
									key={index}
									className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
								>
									<div className="relative h-64">
										<Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
									</div>
									<div className="p-6">
										<h3 className="text-xl font-semibold text-gray-800 mb-1">{member.name}</h3>
										<p className="text-blue-600 font-medium mb-3">{member.role}</p>
										<p className="text-gray-600 text-sm">{member.bio}</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Testimonials */}
				<section className="py-16 bg-white">
					<div className="container mx-auto px-4">
						<div className="text-center mb-12">
							<h2 className="text-3xl font-bold text-gray-800 mb-4">What Our Customers Say</h2>
							<p className="text-gray-600 max-w-2xl mx-auto">
								Don't just take our word for it. Here's what our customers have to say about their AMATAK experience.
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							{testimonials.map((testimonial, index) => (
								<div key={index} className="bg-gray-50 rounded-2xl p-6">
									<div className="flex mb-4">
										{[...Array(testimonial.rating)].map((_, i) => (
											<Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />
										))}
									</div>
									<p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
									<div>
										<p className="font-semibold text-gray-800">{testimonial.name}</p>
										<p className="text-sm text-gray-500">{testimonial.role}</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="py-16 bg-blue-600 text-white">
					<div className="container mx-auto px-4 text-center">
						<h2 className="text-3xl font-bold mb-4">Ready to Join the AMATAK Family?</h2>
						<p className="text-xl mb-8 max-w-2xl mx-auto">
							Discover our latest collections and experience the quality and service that our customers love.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Link
								href="/shop"
								className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2"
							>
								Shop Now
								<ArrowRight size={20} />
							</Link>
							<Link
								href="/contact"
								className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
							>
								Contact Us
							</Link>
						</div>
					</div>
				</section>
			</main>

			<Footer />
		</div>
	)
}
