import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft } from "../assets/icons";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      {
        redirectTo: `${window.location.origin}/update-password`,
      }
    );

    setLoading(false);

    if (error) {
      console.error("Reset error:", error.message);
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center justify-center gap-3 mb-10 cursor-pointer"
        >
          <img
            src="/intellilogo.png"
            alt="Logo"
            className="h-14 w-auto object-contain"
          />
          <span className="text-3xl font-bold text-gray-900">IntelliLearn</span>
        </div>

        <form
          onSubmit={handleReset}
          className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl border border-white/50"
        >
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Recover Password
            </h2>
            <p className="text-gray-500 text-sm">
              {sent
                ? "Check your inbox for the reset link"
                : "Enter your email to receive a reset link"}
            </p>
          </div>

          {sent ? (
            <div className="space-y-6">
              <div className="bg-blue-50 text-blue-700 p-4 rounded-2xl text-sm border">
                A reset link has been sent to your email.
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/login")}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold"
              >
                Return to Login
              </motion.button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Email Address
                </label>

                <div className="relative mt-2">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail size={20} />
                  </div>

                  <input
                    type="email"
                    placeholder="name@example.com"
                    className="w-full pl-12 pr-4 py-4 border rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-4 rounded-2xl font-bold text-white transition ${loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
                  }`}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </motion.button>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="w-full flex items-center justify-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600"
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