// src/components/Hero.jsx
import React, { useState, useEffect } from "react";
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

  return (
    <section className="relative bg-white min-h-screen flex items-center justify-center">
      {/* Glow Background */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 
                    w-full max-w-[52rem] h-[52rem] bg-blue-50 opacity-50 rounded-full blur-3xl -z-10"
      />

      {/* Centered Content */}
      <div className="flex flex-col items-center justify-center text-center px-6 md:px-0 max-w-4xl">
        <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
          ✨ AI-Powered Learning Platform
        </div>

        {/* FIRST LINE */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
          Your AI-Powered
        </h1>

        {/* SECOND LINE – Animated Text */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-blue-600 mb-2">
          <span className="inline-block whitespace-nowrap">
            {displayed}
            <span className="border-r-4 border-blue-600 ml-1 animate-pulse"></span>
          </span>
        </h1>

        {/* THIRD LINE – FULL ORIGINAL TEXT */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
          for Smart Exam Preparation
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          Upload your notes, ask any question, and get context-aware answers directly
          from your own study materials — powered by Retrieval-Augmented Generation (RAG).
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <a
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition-all"
            href="#"
          >
            Get Started <ArrowRight size={18} />
          </a>

          <a
            className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold border border-gray-300 shadow-sm hover:bg-gray-50 transition-all"
            href="#"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}
