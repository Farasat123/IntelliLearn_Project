// src/components/Stats.jsx
import React from "react";
import { Users, Target, Clock } from "../assets/icons";

export default function Stats() {
  const stats = [
    { icon: <Users size={32} className="text-blue-600" />, value: "500+", label: "Active Students" },
    { icon: <Target size={32} className="text-blue-600" />, value: "95%", label: "Accuracy Rate" },
    { icon: <Clock size={32} className="text-blue-600" />, value: "<2s", label: "Response Time" },
  ];

  return (
    <section id="about" className="bg-slate-50 py-16 md:py-24">
      {/* ✓ SAME CORNER SPACING LIKE FEATURES SECTION */}
      <div className="container max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-blue-600 font-semibold">About IntelliLearn</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Bridging the Gap Between <span className="text-blue-600">Learning & AI</span>
          </h2>
          <p className="text-lg text-gray-600">
            IntelliLearn empowers students to focus on understanding concepts instead of searching through endless notes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-lg p-8 text-center flex flex-col items-center"
            >
              <div className="bg-blue-100 p-4 rounded-full mb-4">{s.icon}</div>
              <p className="text-5xl font-extrabold text-gray-900 mb-2">{s.value}</p>
              <p className="text-lg text-gray-600">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
