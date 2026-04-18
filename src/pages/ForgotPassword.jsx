import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Brain } from "../assets/icons";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5173/update-password",
    });

    if (error) {
      alert(error.message);
      return;
    }

    setSent(true);
  };

  const gradientOrbs = [
    { delay: 0, className: "top-10 left-16 w-32 h-32" },
    { delay: 1.2, className: "bottom-12 right-10 w-40 h-40" },
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
        className="absolute inset-y-0 left-1/4 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -z-10"
        animate={{ x: ["-50%", "150%"], opacity: [0, 1, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        {/* Logo Link */}
        <div 
          onClick={() => navigate("/")}
          className="flex items-center justify-center gap-3 mb-10 cursor-pointer group"
        >
          <img 
            src="/intellilogo.png" 
            alt="IntelliLearn Logo" 
            className="h-14 w-auto object-contain transition-transform duration-300 hover:scale-105" 
          />
          <span className="text-3xl font-bold text-gray-900 tracking-tight">IntelliLearn</span>
        </div>

        <form
          onSubmit={handleReset}
          className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl shadow-blue-500/10 border border-white/50"
        >
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Recover Password</h2>
            <p className="text-gray-500 text-sm">
              {sent 
                ? "Check your inbox for the reset link" 
                : "Enter your email address to receive a link"}
            </p>
          </div>

          {sent ? (
            <div className="space-y-6">
              <div className="bg-blue-50 text-blue-700 p-4 rounded-2xl text-sm font-medium border border-blue-100 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                A reset link has been sent to your email.
              </div>

              <motion.button
                whileHover={{ scale: 1.02, translateY: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/login")}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 rounded-2xl font-bold shadow-xl shadow-blue-500/25 transition-all duration-300"
              >
                Return to Login
              </motion.button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <Mail size={20} />
                  </div>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className="w-full pl-12 pr-5 py-4 border border-gray-200 rounded-2xl bg-white/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300 outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02, translateY: -2, backgroundColor: "#1e40af" }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-blue-500/25 transition-all duration-300"
              >
                Send Reset Link
              </motion.button>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="w-full flex items-center justify-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors py-2"
              >
                <ArrowLeft size={16} />
                Back to Login
              </button>
            </div>
          )}
        </form>
      </motion.div>
    </div>
  );
}
