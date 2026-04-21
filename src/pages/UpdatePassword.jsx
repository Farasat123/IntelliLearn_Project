import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, ArrowLeft, CheckCircle } from "../assets/icons";

export default function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [updated, setUpdated] = useState(false);
  const navigate = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      setUpdated(true);
    } finally {
      setIsLoading(false);
    }
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
          onSubmit={handleUpdate}
          className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl shadow-blue-500/10 border border-white/50"
        >
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Set New Password</h2>
            <p className="text-gray-500 text-sm">
              {updated
                ? "Your password has been updated successfully"
                : "Enter your new password below"}
            </p>
          </div>

          {updated ? (
            <div className="space-y-6">
              <div className="bg-green-50 text-green-700 p-4 rounded-2xl text-sm font-medium border border-green-100 flex items-center gap-3">
                <CheckCircle size={20} className="text-green-600 shrink-0" />
                Password updated successfully! You can now log in with your new password.
              </div>

              <motion.button
                type="button"
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
              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 ml-1">New Password</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <Lock size={20} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-2xl bg-white/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300 outline-none"
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

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 ml-1">Confirm Password</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <Lock size={20} />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-2xl bg-white/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300 outline-none"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors duration-200 focus:outline-none"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
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

              <motion.button 
                whileHover={!isLoading ? { scale: 1.02, translateY: -2, backgroundColor: "#1e40af" } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
                disabled={isLoading}
                className={`w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-blue-500/25 transition-all duration-300 flex items-center justify-center gap-2 ${isLoading ? 'opacity-90 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Updating Password...
                  </>
                ) : (
                  'Update Password'
                )}
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
