// src/components/MainFeatures.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  Upload,
  MessageSquare,
  Cpu,
  Shield,
  LayoutDashboard,
  Zap,
} from "../assets/icons";

export default function MainFeatures() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0 },
  };

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
      title: "Get Authorized Answers",
      description:
        "Receive clear, accurate answers with citations from your uploaded materials.",
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
    <section
      id="features"
      className="relative overflow-hidden bg-gradient-to-br from-blue-900/5 via-blue-50 to-white py-16 md:py-24"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <span className="absolute -top-20 right-10 h-64 w-64 rounded-full bg-blue-200/40 blur-3xl" />
        <span className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl" />
        <span className="absolute top-20 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-cyan-100/40 blur-3xl" />
      </div>
      {/* Full-width wrapper with padding so cards show fully */}
      <div className="relative w-full px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">

        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="inline-block bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold">
            Features
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-4">
            Everything You Need to <span className="text-blue-600">Excel</span>
          </h2>

          <p className="text-lg text-gray-600">
            Powerful features designed to transform how you study and prepare for exams.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative rounded-[28px] p-[1px] transition-all duration-300 bg-gradient-to-br from-white/50 via-white/30 to-blue-50/70 hover:from-blue-400/50 hover:via-blue-200/30 hover:to-blue-500/60"
            >
              <div
                className="rounded-[26px] h-full w-full bg-white/90 backdrop-blur border border-white/70 group-hover:border-blue-500 shadow-sm group-hover:shadow-2xl transition-all duration-300 flex flex-col items-start p-6"
              >
                <motion.span
                  className="bg-blue-50 group-hover:bg-blue-100 transition-colors p-3 rounded-xl mb-5 shadow-inner"
                  animate={{ scale: [1, 1.05, 1], rotate: [0, 2, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  {f.icon}
                </motion.span>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{f.title}</h3>

                <p className="text-gray-600">{f.description}</p>

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
