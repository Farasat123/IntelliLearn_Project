// src/components/Testimonials.jsx
import React from "react";
import { motion } from "framer-motion";
import AishaPic from "../assets/students/aisha.jpg";
import HamzaPic from "../assets/students/hamza.jpeg";
import SanaPic from "../assets/students/sana.jpg";


// Testimonial data
const data = [
  { 
    name: "Aisha", 
    role: "Medical Student", 
    text: "Saved me hours in revision. Answers are concise and cited!", 
    img: "/src/assets/students/aisha.jpg"
    
  },
  { 
    name: "Hamza", 
    role: "Engineering Student", 
    text: "Great for quick clarifications and revision reminders.", 
    img: "/src/assets/students/hamza.jpeg"
  },
  { 
    name: "Sana", 
    role: "Law Student", 
    text: "The source citation feature is a lifesaver for studying.", 
    img: "/src/assets/students/sana.jpg"
  },
];

export default function Testimonials() {
  return (
    <section className="bg-slate-50 py-16 md:py-24">
      <div className="container max-w-7xl text-center px-6">
        <h3 className="text-3xl md:text-4xl font-bold mb-10 text-slate-800">
          What Students Say
        </h3>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.map((t, i) => (
            <motion.div
  key={i}
  className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100"
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: "spring", stiffness: 200, damping: 15 }}
>

              {/* Profile Image */}
              <div className="flex justify-center mb-4">
                <img
                  src={t.img}
                  alt={t.name}
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-indigo-100 shadow-sm"
                />
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 italic mb-4 leading-relaxed">
                “{t.text}”
              </p>

              {/* Name and Role */}
              <div className="text-lg font-semibold text-slate-800">{t.name}</div>
              <div className="text-sm text-gray-500">{t.role}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
