// src/components/MainFeatures.jsx
import React from "react";
import {
  Upload,
  MessageSquare,
  Cpu,
  Shield,
  LayoutDashboard,
  Zap,
} from "../assets/icons";

export default function MainFeatures() {
  const features = [
    {
      icon: <Upload size={28} className="text-blue-600" />,
      title: "Upload Study Materials",
      description:
        "Upload PDF, DOCX, or PPT files and build your personalized knowledge base.",
    },
    {
      icon: <MessageSquare size={28} className="text-blue-600" />,
      title: "Ask Questions Instantly",
      description:
        "Get AI-generated contextual answers from your uploaded study materials.",
      
    },
    {
      icon: <Cpu size={28} className="text-blue-600" />,
      title: "Powered by RAG",
      description:
        "Uses Retrieval-Augmented Generation for reliable, source-based responses.",
    },
    {
      icon: <Shield size={28} className="text-blue-600" />,
      title: "Secure and Private",
      description:
        "Your data is encrypted and never shared. Complete privacy guaranteed.",
    },
    {
      icon: <LayoutDashboard size={28} className="text-blue-600" />,
      title: "Personal Dashboard",
      description:
        "Access your uploads, chat history, and track your learning progress.",
    },
    {
      icon: <Zap size={28} className="text-blue-600" />,
      title: "Fast and Accurate",
      description:
        "Get precise answers within seconds. No more searching through notes.",
    },
  ];

  return (
    <section id="features" className="bg-white py-16 md:py-24">
      {/* Full-width wrapper with padding so cards show fully */}
      <div className="w-full px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold">
            Features
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-4">
            Everything You Need to <span className="text-blue-600">Excel</span>
          </h2>

          <p className="text-lg text-gray-600">
            Powerful features designed to transform how you study and prepare for exams.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className={`rounded-3xl p-6 flex flex-col items-start transition-all duration-300 border bg-white shadow-sm hover:shadow-xl hover:scale-[1.03] hover:border-blue-400 ${
                f.highlighted
                  ? "border-blue-500 shadow-lg scale-[1.04]"
                  : "border-gray-200"
              }`}
            >
              <div className="bg-blue-100 p-3 rounded-lg mb-5">
                {f.icon}
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {f.title}
              </h3>

              <p className="text-gray-600">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
