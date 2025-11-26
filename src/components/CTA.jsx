// src/components/CTA.jsx
import React from "react";

export default function CTA() {
  return (
    <section className="bg-white py-16 flex justify-center">
      <div className="container max-w-6xl flex justify-center">
        <div className="bg-blue-600 rounded-2xl shadow-xl text-center px-8 py-12 md:py-16 relative overflow-hidden max-w-6xl w-full">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-700 to-blue-500 opacity-60" />
          <div className="relative z-10 flex flex-col items-center justify-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Ready to Transform Your Study Experience?
            </h2>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
              Join hundreds of students who are already studying smarter with IntelliLearn
            </p>
            <a
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold text-lg shadow-md hover:bg-gray-100 transition-all"
              href="#"
            >
              Start Learning for Free
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
