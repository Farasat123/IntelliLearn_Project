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
  {
    name: "Bilal",
    role: "Business Student",
    text: "Having an AI chat trained on my notes means I revise smarter, not longer.",
    img: "/src/assets/students/aisha.jpg",
  },
  {
    name: "Hiba",
    role: "Computer Science Student",
    text: "Adaptive quizzes highlight my weak spots instantly. Huge confidence boost.",
    img: "/src/assets/students/sana.jpg",
  },
];

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-900/15 via-blue-100 to-white py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <span className="absolute -top-24 right-6 h-72 w-72 rounded-full bg-blue-300/45 blur-[120px]" />
        <span className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-blue-200/50 blur-[130px]" />
        <span className="absolute top-10 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-cyan-200/35 blur-[110px]" />
      </div>
      <div className="relative container max-w-7xl text-center px-6">
        <motion.h3
          className="text-3xl md:text-4xl font-bold mb-10 text-slate-800"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          What Students Say
        </motion.h3>

        <div className="overflow-hidden py-6">
          <motion.div
            className="flex gap-6 px-2"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            {[...data, ...data].map((t, i) => (
              <motion.div
                key={`${t.name}-${i}`}
                className="group relative rounded-[28px] p-[1px] bg-gradient-to-b from-white/60 via-white/30 to-blue-100/40 hover:from-blue-500/60 hover:via-blue-200/40 hover:to-blue-400/40 transition-all duration-300 min-w-[280px] max-w-sm"
                whileHover={{ y: -6, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative bg-white/90 backdrop-blur rounded-[26px] h-full w-full p-6 flex flex-col items-center text-center border border-white/70 group-hover:border-blue-500 shadow-md group-hover:shadow-2xl transition-all duration-300">

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
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
