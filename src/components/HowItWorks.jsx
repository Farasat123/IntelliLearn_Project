// src/components/HowItWorks.jsx
import React from "react";
import { Upload, MessageSquare, CheckCircle } from "../assets/icons";

export default function HowItWorks() {
  const steps = [
    {
      icon: <Upload size={28} className="text-white" />,
      title: "Upload Your Materials",
      description: "Upload PDF, DOCX, or PPT files containing your study notes and materials.",
    },
    {
      icon: <MessageSquare size={28} className="text-white" />,
      title: "Ask Any Question",
      description: "Type your question naturally, just like you would ask a teacher or friend.",
    },
    {
      icon: <CheckCircle size={28} className="text-white" />,
      title: "Get Authorized Answers",
      description: "Receive clear, accurate answers with citations from your uploaded materials.",
    },
  ];

  return (
    <section className="bg-slate-50 py-16 md:py-24">
      {/* SAME SPACING */}
      <div className="container max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 relative">
          <div className="hidden md:block absolute top-1/2 -translate-y-1/2 left-0 right-0">
            <svg width="100%" height="2" className="overflow-visible">
              <line
                x1="10%"
                y1="50%"
                x2="90%"
                y2="50%"
                stroke="#e5e7eb"
                strokeWidth="2"
                strokeDasharray="8 8"
              />
            </svg>
          </div>

          {steps.map((s, i) => (
            <div
              key={i}
              className="
                bg-white rounded-2xl shadow-xl p-8 
                flex flex-col items-center text-center relative
                transition-all duration-300 ease-out
                hover:scale-[1.03] hover:shadow-2xl hover:-translate-y-1
              "
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-4 border-slate-50">
                  {i + 1}
                </div>
              </div>

              <div className="bg-blue-600 p-4 rounded-full mb-5">
                {s.icon}
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {s.title}
              </h3>

              <p className="text-gray-600">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
