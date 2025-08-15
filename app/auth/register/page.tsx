"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/AuthContext"

interface User {
	id: string;
	name: string;
	email: string;
	phone: string;
	password: string;
	role: string;
	createdAt: string;
}

export default function RegisterPage() {
	const router = useRouter();
	const { login } = useAuth();
	const [form, setForm] = useState({
		name: "",
		email: "",
		phone: "",
		password: "",
		confirmPassword: ""
	});
	const [isRegistering, setIsRegistering] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!form.name || !form.email || !form.phone || !form.password || !form.confirmPassword) {
			alert("Please fill in all fields.");
			return;
		}
		if (form.password !== form.confirmPassword) {
			alert("Passwords do not match.");
			return;
		}
		setIsRegistering(true);
		// Check if user already exists
		const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
		if (users.some(u => u.email === form.email || u.phone === form.phone)) {
			alert("A user with this email or phone already exists.");
			setIsRegistering(false);
			return;
		}
		const newUser: User = {
			id: `user-${Date.now()}`,
			name: form.name,
			email: form.email,
			phone: form.phone,
			password: form.password,
			role: "customer",
			createdAt: new Date().toISOString(),
		};
		localStorage.setItem("users", JSON.stringify([...users, newUser]));
		// Log in the user immediately after registration
		login(newUser.email, newUser.role);
		setIsRegistering(false);
		router.push("/");
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
			<div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg transition-all">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900">Create an Account</h1>
					<p className="mt-2 text-gray-600">Sign up to get started</p>
				</div>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
						<input
							type="text"
							name="name"
							id="name"
							value={form.name}
							onChange={handleChange}
							required
							className="w-full rounded-lg border-gray-300 p-4 text-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
							placeholder="Your Full Name"
						/>
					</div>
					<div>
						<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
						<input
							type="email"
							name="email"
							id="email"
							value={form.email}
							onChange={handleChange}
							required
							className="w-full rounded-lg border-gray-300 p-4 text-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
							placeholder="Email Address"
						/>
					</div>
					<div>
						<label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
						<input
							type="tel"
							name="phone"
							id="phone"
							value={form.phone}
							onChange={handleChange}
							required
							className="w-full rounded-lg border-gray-300 p-4 text-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
							placeholder="Phone Number"
						/>
					</div>
					<div>
						<label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
						<input
							type="password"
							name="password"
							id="password"
							value={form.password}
							onChange={handleChange}
							required
							className="w-full rounded-lg border-gray-300 p-4 text-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
							placeholder="Password"
						/>
					</div>
					<div>
						<label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
						<input
							type="password"
							name="confirmPassword"
							id="confirmPassword"
							value={form.confirmPassword}
							onChange={handleChange}
							required
							className="w-full rounded-lg border-gray-300 p-4 text-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
							placeholder="Confirm Password"
						/>
					</div>
					<button
						type="submit"
						disabled={isRegistering}
						className="w-full rounded-lg bg-blue-600 px-5 py-4 text-lg font-semibold text-white shadow-md hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
					>
						{isRegistering ? "Registering..." : "Register"}
					</button>
				</form>
				<div className="mt-6 text-center text-sm text-gray-500">
					Already have an account?{' '}
					<Link href="/auth/signin" className="underline hover:text-gray-700">Sign in</Link>
				</div>
			</div>
		</div>
	);
}
