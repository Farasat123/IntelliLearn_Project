// src/components/WhyChooseUs.jsx
import React from "react";
import { CheckCircle } from "../assets/icons";

export default function WhyChooseUs() {
  const points = [
    "Personalized learning experience based on your own materials",
    "Save hours of manual note searching and revision",
    "Get instant clarification on complex topics",
    "Study smarter with AI-powered insights",
    "Secure and private - your data stays yours",
    "Access anywhere, anytime from any device",
  ];

  return (
    <section className="bg-white py-16 md:py-24">
      {/* ✅ SAME CORNER SPACING AS OTHER SECTIONS */}
      <div className="container max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        <div className="flex flex-col gap-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Why Choose <span className="text-blue-600">IntelliLearn?</span>
          </h2>

          <ul className="space-y-4">
            {points.map((p, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle size={24} className="text-blue-600 flex-shrink-0 mt-1" />
                <span className="text-lg text-gray-700">{p}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-blue-600 text-white rounded-2xl p-8 md:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full" />
          <div className="absolute -bottom-16 -left-10 w-40 h-40 bg-white/10 rounded-full" />

          <h3 className="text-2xl font-bold mb-4 relative z-10">Our Mission</h3>

          <p className="text-lg text-blue-100 mb-6 relative z-10">
            To make quality education accessible and efficient for every student by combining the power of AI with personalized learning materials. We believe that technology should enhance, not replace, the learning experience.
          </p>

          <div className="inline-block bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium relative z-10">
            Powered by Advanced RAG Technology
          </div>
        </div>

      </div>
    </section>
  );
}
