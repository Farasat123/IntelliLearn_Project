// src/pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../supabaseClient";
import { Brain, Mail, Lock, User } from "../assets/icons";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success"); // "success" | "error" | "warning"

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      setModalType("warning");
      setModalMessage("Please fill all fields before signing up.");
      setShowEmailModal(true);
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
          emailRedirectTo: `${window.location.origin}/confirm`,
        },
      });

      if (error) {
        setModalType("error");
        setModalMessage(error.message);
        setShowEmailModal(true);
        return;
      }

      setModalType("success");
      setModalMessage("We've sent a confirmation link to your email. Please check your inbox and click the link to activate your account.");
      setShowEmailModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard-home`,
      },
    });

    if (error) alert(error.message);
  };

  const gradientOrbs = [
    { delay: 0, className: "top-10 left-16 w-32 h-32" },
    { delay: 0.8, className: "bottom-12 right-10 w-40 h-40" },
    { delay: 1.6, className: "top-1/3 right-1/4 w-24 h-24" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-blue-100 flex items-center justify-center px-6">

      {/* Animated gradient orbs */}
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
          <div className="flex items-center gap-3 mb-6">
            <img
              src="/intellilogo.png"
              alt="IntelliLearn Logo"
              className="h-14 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
            <span className="text-3xl font-bold text-gray-900 tracking-tight">IntelliLearn</span>
          </div>

          <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-[1.1]">
            Join the <br />
            <span className="text-blue-600">Future of Learning</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-lg leading-relaxed">
            Create an account to start your journey with study tool and personalized exam preparation.
          </p>

          <div className="flex flex-col gap-3">
            {[
              "All-in-one study platform",
              "Advanced tutor assistance",
              "Personalized exam prep"
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 text-gray-700 font-semibold text-lg">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-blue-600" />
                </div>
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT SIDE: Signup Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center justify-center lg:justify-end"
        >
          <form
            onSubmit={handleSignup}
            className="bg-white/80 backdrop-blur-xl p-7 rounded-[2rem] shadow-2xl shadow-blue-500/10 w-full max-w-md border border-white/50"
          >
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-blue-600 mb-2 tracking-tight">Sign Up</h2>
              <p className="text-gray-500 font-medium">Create your account to get started</p>
            </div>

            <div className="space-y-4">
              {/* Username */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 ml-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <User size={20} />
                  </div>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full pl-12 pr-5 py-3 border border-gray-200 rounded-2xl bg-white/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300 outline-none"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

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
                <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <Lock size={20} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-2xl bg-white/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300 outline-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors duration-200 focus:outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Signup Button */}
            <motion.button
              whileHover={!isLoading ? {
                scale: 1.02,
                translateY: -3,
                filter: "brightness(1.1)",
                boxShadow: "0 20px 25px -5px rgb(59 130 246 / 0.4)"
              } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white mt-4 py-3.5 rounded-2xl font-bold shadow-xl shadow-blue-500/25 transition-all duration-300 flex items-center justify-center gap-2 ${isLoading ? 'opacity-90 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </motion.button>

            {/* Divider */}
            <div className="relative flex items-center my-6">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="px-4 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                or
              </span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Google Button */}
            <motion.button
              type="button"
              onClick={handleGoogleSignup}
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
                Sign up with Google
              </span>
            </motion.button>

            {/* Login Link */}
            <p className="text-center mt-6 text-gray-600 text-sm font-medium">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 font-bold hover:underline">
                Log in
              </Link>
            </p>
          </form>
        </motion.div>
      </div>

      {/* ─── Email Confirmation Modal ─── */}
      <AnimatePresence>
        {showEmailModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEmailModal(false)}
            />

            {/* Modal Card */}
            <motion.div
              className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 overflow-hidden"
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
            >
              {/* Decorative top gradient bar */}
              <div
                className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl ${
                  modalType === "success"
                    ? "bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400"
                    : modalType === "error"
                    ? "bg-gradient-to-r from-red-500 via-red-400 to-orange-400"
                    : "bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400"
                }`}
              />

              {/* Icon */}
              <motion.div
                className="flex justify-center mb-5"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.15 }}
              >
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center ${
                    modalType === "success"
                      ? "bg-blue-50"
                      : modalType === "error"
                      ? "bg-red-50"
                      : "bg-amber-50"
                  }`}
                >
                  {modalType === "success" ? (
                    <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  ) : modalType === "error" ? (
                    <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                  ) : (
                    <svg className="w-10 h-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                  )}
                </div>
              </motion.div>

              {/* Title */}
              <motion.h3
                className={`text-2xl font-bold text-center mb-2 ${
                  modalType === "success"
                    ? "text-gray-900"
                    : modalType === "error"
                    ? "text-red-700"
                    : "text-amber-700"
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {modalType === "success"
                  ? "Check Your Email"
                  : modalType === "error"
                  ? "Signup Failed"
                  : "Missing Information"}
              </motion.h3>

              {/* Message */}
              <motion.p
                className="text-gray-500 text-center text-sm leading-relaxed mb-5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                {modalMessage}
              </motion.p>

              {/* Email badge (only on success) */}
              {modalType === "success" && email && (
                <motion.div
                  className="flex items-center justify-center gap-2 bg-blue-50 border border-blue-100 rounded-2xl py-3 px-4 mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Mail size={16} className="text-blue-500 flex-shrink-0" />
                  <span className="text-blue-700 font-semibold text-sm truncate">{email}</span>
                </motion.div>
              )}

              {/* Action Buttons */}
              <motion.div
                className="flex flex-col gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                {modalType === "success" ? (
                  <>
                    <a
                      href="https://mail.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                      Open Gmail
                    </a>
                    <button
                      onClick={() => {
                        setShowEmailModal(false);
                        navigate("/login");
                      }}
                      className="w-full py-3 rounded-2xl font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all duration-300"
                    >
                      Go to Login
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setShowEmailModal(false)}
                    className={`w-full py-3.5 rounded-2xl font-bold shadow-lg transition-all duration-300 hover:-translate-y-0.5 text-white ${
                      modalType === "error"
                        ? "bg-gradient-to-r from-red-600 to-red-500 shadow-red-500/25 hover:shadow-red-500/40"
                        : "bg-gradient-to-r from-amber-500 to-amber-400 shadow-amber-500/25 hover:shadow-amber-500/40"
                    }`}
                  >
                    Try Again
                  </button>
                )}
              </motion.div>

              {/* Close button (X) */}
              <button
                onClick={() => setShowEmailModal(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors group"
              >
                <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
