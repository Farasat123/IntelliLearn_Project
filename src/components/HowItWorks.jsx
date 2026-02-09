// src/components/HowItWorks.jsx
import React from "react";
import { motion } from "framer-motion";
import { Upload, MessageSquare, CheckCircle } from "../assets/icons";

export default function HowItWorks() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: "easeOut",
        staggerChildren: 0.15,
        delayChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0 },
  };

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
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-900/15 via-blue-100 to-white py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <span className="absolute -top-24 right-6 h-72 w-72 rounded-full bg-blue-300/45 blur-[120px]" />
        <span className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-blue-200/50 blur-[130px]" />
        <span className="absolute top-10 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-cyan-200/35 blur-[110px]" />
      </div>
      {/* SAME SPACING */}
      <div className="relative container max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="inline-block bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold">
            Workflow
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4">
            How It Works
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="hidden md:block absolute top-1/2 -translate-y-1/2 left-0 right-0">
            <svg width="100%" height="40" className="overflow-visible">
              <defs>
                <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="4" refY="2" orient="auto">
                  <polygon points="0 0, 4 2, 0 4" fill="#60a5fa" />
                </marker>
              </defs>
              <line
                x1="10%"
                y1="50%"
                x2="90%"
                y2="50%"
                stroke="#93c5fd"
                strokeWidth="2.5"
                markerEnd="url(#arrowhead)"
              />
            </svg>
          </div>

          {steps.map((s, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative rounded-[28px] p-[1px] bg-gradient-to-b from-white/60 via-white/30 to-blue-100/40 hover:from-blue-500/60 hover:via-blue-200/40 hover:to-blue-400/40 transition-all duration-300"
            >
              <div className="relative bg-white/90 backdrop-blur rounded-[26px] h-full w-full p-8 flex flex-col items-center text-center border border-white/70 group-hover:border-blue-500 shadow-md group-hover:shadow-2xl transition-all duration-300">
                <motion.div
                  className="bg-blue-600 p-4 rounded-full mb-5 shadow-lg"
                  animate={{ scale: [1, 1.05, 1], rotate: [0, 2, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  {s.icon}
                </motion.div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{s.title}</h3>

                <p className="text-gray-600">{s.description}</p>

                <motion.span
                  className="mt-5 text-sm font-semibold text-blue-600 opacity-0 group-hover:opacity-100"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  
                </motion.span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
