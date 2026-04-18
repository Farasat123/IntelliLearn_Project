// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../supabaseClient";
import { Brain, Mail, Lock } from "../assets/icons";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/dashboard-home");
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:5173/dashboard-home",
      },
    });

    if (error) alert("Google sign-in failed");
  };

  const gradientOrbs = [
    { delay: 0, className: "top-10 left-16 w-32 h-32" },
    { delay: 0.8, className: "bottom-12 right-10 w-40 h-40" },
    { delay: 1.6, className: "top-1/3 right-1/4 w-24 h-24" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-blue-100 flex items-center justify-center px-6">

      {/* Animated gradient orbs (Consistency with Hero) */}
      {gradientOrbs.map((orb, idx) => (
        <motion.span
          key={idx}
          className={`absolute rounded-full blur-3xl bg-blue-200/40 -z-10 ${orb.className}`}
          animate={{
            opacity: [0.4, 0.7, 0.4],
            scale: [1, 1.2, 1],
            y: [0, -15, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, delay: orb.delay, ease: "easeInOut" }}
        />
      ))}

      {/* Light sweep effect */}
      <motion.div
        className="absolute inset-y-0 left-1/3 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-6 -z-10"
        animate={{ x: ["-50%", "120%"], opacity: [0, 1, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* MAIN CONTAINER */}
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

        {/* LEFT SIDE: Branding & Info */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hidden lg:flex flex-col justify-center"
        >
          <div className="flex items-center gap-3 mb-8">
            <img 
              src="/intellilogo.png" 
              alt="IntelliLearn Logo" 
              className="h-14 w-auto object-contain transition-transform duration-300 hover:scale-105" 
            />
            <span className="text-3xl font-bold text-gray-900 tracking-tight">IntelliLearn</span>
          </div>

          <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-[1.1]">
            Welcome back to the <br />
            <span className="text-blue-600">Future of Learning</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-lg leading-relaxed">
            Ready to continue your study journey? Log in to access your personalized preparation material.
          </p>

          <div className="flex flex-col gap-3">
            {[
              "Context-aware AI assistance",
              "Smart study notes management",
              "Personalized exam prep"
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 text-gray-700 font-medium">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-blue-600" />
                </div>
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT SIDE: Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center justify-center lg:justify-end"
        >
          <form
            onSubmit={handleLogin}
            className="bg-white/80 backdrop-blur-xl p-7 rounded-[2rem] shadow-2xl shadow-blue-500/10 w-full max-w-md border border-white/50"
          >
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-blue-600 mb-2">Sign In</h2>
              <p className="text-gray-500 font-medium">Enter your credentials to continue</p>
            </div>

            <div className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <Mail size={20} />
                  </div>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className="w-full pl-12 pr-5 py-3 border border-gray-200 rounded-2xl bg-white/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300 outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-sm font-semibold text-gray-700">Password</label>
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:scale-105 active:scale-95 transition-all duration-200"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <Lock size={20} />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-12 pr-5 py-3 border border-gray-200 rounded-2xl bg-white/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300 outline-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-3 mt-4 mb-6 px-1">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
              />
              <label htmlFor="remember" className="text-sm font-medium text-gray-600 cursor-pointer">
                Keep me signed in
              </label>
            </div>

            {/* Login Button */}
            <motion.button
              whileHover={{ scale: 1.01, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3.5 rounded-2xl font-bold shadow-xl shadow-blue-500/25 hover:shadow-blue-500/35 transition-all duration-300"
            >
              Sign In
            </motion.button>

            {/* Divider */}
            <div className="relative flex items-center my-7">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="px-4 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                or
              </span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Google Button */}
            <motion.button
              type="button"
              onClick={signInWithGoogle}
              whileHover={{ scale: 1.01, backgroundColor: "#f9fafb" }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-3 border border-gray-200 py-3 rounded-2xl bg-white 
              hover:border-blue-300 transition-all duration-300 group"
            >
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google"
                className="w-5 h-5 group-hover:scale-110 transition-transform"
              />
              <span className="font-bold text-gray-700">
                Continue with Google
              </span>
            </motion.button>

            {/* Signup Link */}
            <p className="text-center mt-7 text-gray-600 text-sm font-medium">
              Don't have an account?{" "}
              <button
                type="button"
                className="text-blue-600 font-bold hover:underline"
                onClick={() => navigate("/signup")}
              >
                Sign up
              </button>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}