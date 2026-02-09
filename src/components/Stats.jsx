// src/components/Stats.jsx
import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Target, Clock } from "../assets/icons";

function AnimatedNumber({ start, end, duration = 1800, prefix = "", suffix = "", decimals = 0 }) {
  const [value, setValue] = useState(start);
  const numberRef = useRef(null);
  const hasAnimated = useRef(false);
  const isInView = useInView(numberRef, { once: true, amount: 0.8 });

  useEffect(() => {
    if (!isInView || hasAnimated.current) {
      return;
    }
    hasAnimated.current = true;
    const frameDuration = 30;
    const totalFrames = Math.max(Math.round(duration / frameDuration), 1);
    let frame = 0;

    const counter = setInterval(() => {
      frame += 1;
      const progress = Math.min(frame / totalFrames, 1);
      const nextValue = start + (end - start) * progress;
      setValue(nextValue);

      if (progress >= 1) {
        clearInterval(counter);
        setValue(end);
      }
    }, frameDuration);

    return () => clearInterval(counter);
  }, [isInView, start, end, duration]);

  const formattedValue = decimals > 0 ? Number(value).toFixed(decimals) : Math.round(value).toLocaleString();

  return (
    <span ref={numberRef}>
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  );
}

export default function Stats() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0 },
  };

  const stats = [
    {
      icon: <Users size={32} className="text-blue-600" />,
      label: "Active Students",
      start: 100,
      end: 500,
      suffix: "+",
      duration: 2000,
    },
    {
      icon: <Target size={32} className="text-blue-600" />,
      label: "Accuracy Rate",
      start: 40,
      end: 95,
      suffix: "%",
      duration: 1800,
    },
    {
      icon: <Clock size={32} className="text-blue-600" />,
      label: "Response Time",
      start: 5,
      end: 2,
      prefix: "<",
      suffix: "s",
      duration: 1500,
    },
  ];

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-gradient-to-br from-blue-900/15 via-blue-100 to-white py-16 md:py-24"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <span className="absolute -top-24 right-6 h-72 w-72 rounded-full bg-blue-300/45 blur-[120px]" />
        <span className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-blue-200/50 blur-[130px]" />
        <span className="absolute top-10 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-cyan-200/35 blur-[110px]" />
      </div>
      {/* ✓ SAME CORNER SPACING LIKE FEATURES SECTION */}
      <div className="relative container max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="text-blue-600 font-semibold">About IntelliLearn</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Bridging the Gap Between <span className="text-blue-600">Learning & AI</span>
          </h2>
          <p className="text-lg text-gray-600">
            IntelliLearn empowers students to focus on understanding concepts instead of searching through endless notes.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {stats.map((s, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group relative rounded-[28px] p-[1px] bg-gradient-to-b from-white/60 via-white/30 to-blue-100/40 hover:from-blue-500/60 hover:via-blue-200/40 hover:to-blue-400/40 transition-all duration-300"
            >
              <div className="rounded-[26px] h-full w-full bg-white/90 backdrop-blur border border-white/70 group-hover:border-blue-500 shadow-md group-hover:shadow-2xl transition-all duration-300 flex flex-col items-center p-8 text-center">
                <motion.span
                  className="bg-blue-50 group-hover:bg-blue-100 transition-colors p-4 rounded-full mb-4"
                  animate={{ scale: [1, 1.05, 1], rotate: [0, 2, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  {s.icon}
                </motion.span>
                <p className="text-5xl font-extrabold text-gray-900 mb-2">
                  <AnimatedNumber
                    start={s.start}
                    end={s.end}
                    prefix={s.prefix}
                    suffix={s.suffix}
                    duration={s.duration}
                    decimals={s.decimals || 0}
                  />
                </p>
                <p className="text-lg text-gray-600">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
