"use client"
import "./signin.css"

import { useState } from "react"
import { auth, provider, signInWithPopup } from "@/firebase";
import { useAuth } from "@/lib/AuthContext"
import { useRouter } from "next/navigation"
import Link from "next/link"

import Image from "next/image";

// This defines the different screens or "steps" the user can be on.
type AuthStep = 'phone' | 'otp' | 'details';

// Define a User interface based on the newUser object structure
interface User {
  id: string;
  phone: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

// Mock user database
const mockUsers = [
  { role: "admin", email: "admin@gmail.com", phone: "012345678", password: "admin123" },
  { role: "user", email: "amatak@gmail.com", phone: "098765432", password: "user123" }
];

export default function AuthPage() {
  const { login } = useAuth();
  const router = useRouter();

  // Google login handler
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (user.email === "khikhetun@gmail.com") {
        // Optionally, set user in your context or localStorage
        login(user.email, "admin");
        router.push("/Amatak-admin");
      } else {
        alert("Only the admin email is allowed.");
      }
    } catch (error) {
      alert("Google login failed.");
    }
  };

  // This state variable keeps track of which screen the user is currently seeing.
  const [authStep, setAuthStep] = useState<AuthStep | 'login' | 'done'>('phone');

  // State for login form
  const [loginEmailOrPhone, setLoginEmailOrPhone] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  // Mock login handler
  const handleLogin = () => {
    const foundUser = mockUsers.find(
      (u) =>
        (u.email === loginEmailOrPhone || u.phone === loginEmailOrPhone) &&
        u.password === loginPassword
    );

    if (foundUser) {
      alert(`Login successful! Welcome ${foundUser.role}`);
      localStorage.setItem("loggedInUser", JSON.stringify(foundUser));
      login(foundUser.email, foundUser.role); // update AuthContext
      router.push("/");
    } else {
      alert("Invalid credentials. Please check and try again.");
    }
  };

  // State for all the form inputs
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [userDetails, setUserDetails] = useState({ name: '', email: '' });

  // State to manage loading spinners on buttons
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  
  // This will store the OTP that we "send"
  const [generatedOtp, setGeneratedOtp] = useState("");

  // Handles input changes for the user details form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({ ...prev, [name]: value }));
  };

  // --- Step 1: Send OTP to the user's phone ---
  const handleSendOtp = async () => {
    // --- THIS IS THE CORRECTED VALIDATION ---
    if (!phone || !/^(?:0\d{8,9}|\+855\d{8,9})$/.test(phone)) {
  alert("Please enter a valid phone number, like 012345678 or +85512345678.");
  return;
} // -----------------------------------------

  setIsSendingOtp(true);
  // Simulate a network request to send the OTP
  await new Promise(resolve => setTimeout(resolve, 1500));
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setAuthStep('otp'); // <-- Move the user to the OTP screen
    setIsSendingOtp(false);
    console.log(`Generated OTP for ${phone}: ${newOtp}`); // For testing purposes
    alert("An OTP has been sent to your phone!");
  };

  // --- Step 2: Verify the OTP and check for Admin ---
  const handleVerifyOtp = async () => {
    if (otp !== generatedOtp) {
      alert("Invalid OTP. Please try again.");
      return;
    }
    setIsVerifying(true);

    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
    const existingUser = users.find((user: User) => user.phone === phone);
    const adminPhoneNumber = "010101010"; // Your designated admin phone number

    if (existingUser) {
      // --- User exists, log them in ---
      login(existingUser.phone, existingUser.role || "customer");
      // --- Check if they are an admin ---
      if (existingUser.phone === adminPhoneNumber) {
        router.push("/Amatak-admin"); // Redirect admin to the admin dashboard
      } else {
        router.push("/");
      }
      setIsVerifying(false);
      return;
    }
    setAuthStep('details');
    setIsVerifying(false);
  };

  // --- Step 3: Complete Registration ---
  const handleCompleteRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userDetails.name) {
      alert("Please enter your full name to continue.");
      return;
    }
    setIsRegistering(true);

    const newUser: User = {
      id: `user-${Date.now()}`,
      phone: phone,
      name: userDetails.name,
      email: userDetails.email,
      role: "customer",
      createdAt: new Date().toISOString(),
    };

    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
    localStorage.setItem("users", JSON.stringify([...users, newUser]));
    
    console.log("New user registered with details:", newUser);
    login(phone, newUser.role); // Log the new user in
    
    await new Promise(resolve => setTimeout(resolve, 500));
    router.push("/");
    setIsRegistering(false);
  };

  // This function decides which title to show based on the current step
  const getTitle = () => {
    switch (authStep) {
      case 'phone': return "Sign in or create an account";
      case 'otp': return "Enter the OTP we sent you";
      case 'details': return "A few more details to get started";
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg transition-all">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {authStep === 'details' ? "Welcome!" : "Hello!"}
          </h1>
          <p className="mt-2 text-gray-600">{getTitle()}</p>
        </div>

        {/* Login form for mock users */}
        {authStep === 'login' && (
          <div>
            <input
              type="text"
              placeholder="Email or Phone"
              value={loginEmailOrPhone}
              onChange={e => setLoginEmailOrPhone(e.target.value)}
              className="w-full rounded-lg border-gray-300 p-4 text-lg shadow-sm mb-4"
            />
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={e => setLoginPassword(e.target.value)}
              className="w-full rounded-lg border-gray-300 p-4 text-lg shadow-sm mb-4"
            />
            <button
              onClick={handleLogin}
              className="w-full rounded-lg bg-blue-600 px-5 py-4 text-lg font-semibold text-white shadow-md hover:bg-blue-700"
            >
              Login
            </button>
            <button
              onClick={() => setAuthStep('phone')}
              className="mt-2 w-full text-center text-sm text-gray-600 hover:text-blue-600"
            >
              Use phone/OTP instead
            </button>
            <div className="mt-2 w-full text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/auth/register" className="underline hover:text-blue-600">Register</Link>
            </div>
          </div>
        )}

        {/* Phone/OTP/Registration flow */}
        {authStep === 'phone' && (
          <div>
            <label htmlFor="phone" className="sr-only">Phone Number</label>
            <input
              type="tel" name="phone" id="phone" placeholder="e.g., +85510101010"
              value={phone} onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border-gray-300 p-4 text-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <button
              onClick={handleSendOtp} disabled={isSendingOtp}
              className="mt-4 w-full rounded-lg bg-blue-600 px-5 py-4 text-lg font-semibold text-white shadow-md hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
            >
              {isSendingOtp ? "Sending..." : "Continue with Phone"}
            </button>
            <button
              onClick={() => setAuthStep('login')}
              className="mt-2 w-full text-center text-sm text-gray-600 hover:text-blue-600"
            >
              Use email/password instead
            </button>
          </div>
        )}
      
        {authStep === 'otp' && (
          <div>
            <label htmlFor="otp" className="sr-only">OTP</label>
            <input
              type="text" name="otp" id="otp" placeholder="Enter 6-digit OTP"
              value={otp} onChange={(e) => setOtp(e.target.value)}
              className="w-full rounded-lg border-gray-300 p-4 text-lg shadow-sm focus:border-green-500 focus:ring-green-500"
            />
            <button
              onClick={handleVerifyOtp} disabled={isVerifying}
              className="mt-4 w-full rounded-lg bg-green-600 px-5 py-4 text-lg font-semibold text-white shadow-md hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-400"
            >
              {isVerifying ? "Verifying..." : "Verify & Continue"}
            </button>
            <button onClick={() => setAuthStep('phone')} className="mt-2 w-full text-center text-sm text-gray-600 hover:text-blue-600">
              Use a different phone number?
            </button>
          </div>
        )}

        {authStep === 'details' && (
          <form onSubmit={handleCompleteRegistration}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="sr-only">Full Name</label>
                <input
                  type="text" name="name" id="name" placeholder="Your Full Name" required
                  value={userDetails.name} onChange={handleInputChange}
                  className="w-full rounded-lg border-gray-300 p-4 text-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">Email Address (Optional)</label>
                <input
                  type="email" name="email" id="email" placeholder="Email Address (Optional)"
                  value={userDetails.email} onChange={handleInputChange}
                  className="w-full rounded-lg border-gray-300 p-4 text-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit" disabled={isRegistering}
                className="w-full rounded-lg bg-blue-600 px-5 py-4 text-lg font-semibold text-white shadow-md hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
              >
                {isRegistering ? "Saving..." : "Complete Registration"}
              </button>
            </div>
          </form>
        )}

        {/* Google login and legal links for phone step only */}
        {authStep === 'phone' && (
          <>
            <div className="relative mt-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div>
              <div className="relative flex justify-center text-sm"><span className="bg-white px-2 text-gray-500">Or continue with</span></div>
            </div>
            <div className="mt-6">
              <button
                onClick={handleGoogleLogin}
                className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-5 py-3 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 google-btn-shadow"
              >
                <Image className="h-6 w-6" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width={24} height={24} />
                <span className="text-base font-medium">Sign in with Google</span>
              </button>
              <p className="text-xs text-gray-400 mt-2 text-center">We use Google to securely authenticate your account.</p>
            </div>
          </>
        )}
        
        <div className="mt-6 text-center text-xs text-gray-500">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-gray-700">Terms of Service</Link> and{" "}
            <Link href="/privacy" className="underline hover:text-gray-700">Privacy Policy</Link>.
        </div>
      </div>
    </div>
  );
}