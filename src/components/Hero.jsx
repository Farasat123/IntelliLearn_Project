// src/components/Hero.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "../assets/icons";

export default function Hero() {
  const fullText = "Study Partner";
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const typingSpeed = isDeleting ? 250 : 300;

    const handleTyping = () => {
      if (!isDeleting && displayed.length < fullText.length) {
        setDisplayed(fullText.slice(0, displayed.length + 1));
      } else if (isDeleting && displayed.length > 0) {
        setDisplayed(fullText.slice(0, displayed.length - 1));
      } else if (displayed.length === fullText.length) {
        setTimeout(() => setIsDeleting(true), 1000);
      } else if (displayed.length === 0 && isDeleting) {
        setIsDeleting(false);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayed, isDeleting]);

  const gradientOrbs = [
    { delay: 0, className: "top-10 left-16 w-32 h-32" },
    { delay: 0.8, className: "bottom-12 right-10 w-40 h-40" },
    { delay: 1.6, className: "top-1/3 right-1/4 w-24 h-24" },
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-blue-100 min-h-screen flex items-center justify-center px-6 py-20 md:py-28"
    >
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

      {/* Light sweep */}
      <motion.div
        className="absolute inset-y-0 left-1/3 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-6 -z-10"
        animate={{ x: ["-50%", "120%"], opacity: [0, 1, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Centered Content */}
      <motion.div
        className="flex flex-col items-center justify-center text-center max-w-4xl gap-4"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
        <motion.div
          className="inline-flex items-center gap-2 bg-blue-100/80 text-blue-800 px-5 py-1.5 rounded-full text-sm font-semibold shadow-sm"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          ✨ AI-Powered Learning Platform
        </motion.div>

        {/* FIRST LINE */}
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
        >
          Your AI-Powered
        </motion.h1>

        {/* SECOND LINE – Animated Text */}
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-blue-600 mb-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.6, ease: "easeOut" }}
        >
          <span className="inline-block whitespace-nowrap">
            {displayed}
            <span className="border-r-4 border-blue-500 ml-1 animate-pulse"></span>
          </span>
        </motion.h1>

        {/* THIRD LINE – FULL ORIGINAL TEXT */}
        <motion.h1
          className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
        >
          for Smart Exam Preparation
        </motion.h1>

        <motion.p
          className="text-lg text-gray-600 max-w-2xl"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.6, ease: "easeOut" }}
        >
          Upload your notes, ask any question, and get context-aware answers directly
          from your own study materials.
        </motion.p>

        <motion.div
          className="flex flex-wrap gap-4 justify-center"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
        >
          <motion.a
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-7 py-3 rounded-lg font-semibold shadow-lg shadow-blue-500/20"
            href="#"
            whileHover={{ scale: 1.05, translateY: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started <ArrowRight size={18} />
          </motion.a>

          <motion.a
            className="bg-white/90 text-gray-900 px-7 py-3 rounded-lg font-semibold border border-gray-200 shadow-sm"
            href="#"
            whileHover={{ scale: 1.05, translateY: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Learn More
          </motion.a>
        </motion.div>

        {/* Interactive stats */}
        <motion.div
          className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 w-full"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.15 },
            },
          }}
        >
          
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
