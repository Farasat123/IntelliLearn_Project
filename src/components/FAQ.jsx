import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const faqs = [
  { q: "How do I upload my notes?", a: "Go to your dashboard and click 'Upload'. Supported formats: PDF, DOCX, PPT." },
  { q: "Is my data private?", a: "Yes. All user data is private and encrypted. We never share your materials." },
  { q: "How accurate are answers?", a: "Answers are sourced from your uploaded materials using RAG. Accuracy depends on the quality of your notes." },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-900/15 via-blue-100 to-white py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <span className="absolute -top-24 right-6 h-72 w-72 rounded-full bg-blue-300/45 blur-[120px]" />
        <span className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-blue-200/50 blur-[130px]" />
        <span className="absolute top-10 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-cyan-200/35 blur-[110px]" />
      </div>
      <div className="relative container max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] items-start">
          <motion.div
            className="text-left"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white/50 text-blue-700 px-4 py-1 text-sm font-semibold">
              Need help?
            </span>
            <h3 className="text-3xl md:text-4xl font-bold mt-4 text-slate-900">
              Frequently Asked Questions
            </h3>
            <p className="text-lg text-slate-600 mt-4">
              Everything you need to know about getting started with IntelliLearn, from uploading materials to privacy and response accuracy.
            </p>

            
          </motion.div>

          <motion.div
            className="space-y-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { staggerChildren: 0.15, ease: "easeOut" },
              },
            }}
          >
          {faqs.map((f, i) => {
            const isOpen = openIndex === i;

            return (
              <motion.div
                key={i}
                onClick={() => toggleFAQ(i)}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className={`cursor-pointer group rounded-[28px] p-[1px] transition-all duration-300 bg-gradient-to-b from-white/60 via-white/30 to-blue-100/40 hover:from-blue-500/60 hover:via-blue-200/40 hover:to-blue-400/40`}
              >
                <div className="bg-white/90 backdrop-blur rounded-[26px] h-full w-full p-6 border border-white/70 group-hover:border-blue-500 shadow-sm group-hover:shadow-xl transition-all duration-300">
                  {/* Question Row */}
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-800 text-left">{f.q}</p>

                    <ChevronDown
                      size={20}
                      className={`transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-blue-600" : "rotate-0 text-slate-600"
                      }`}
                    />
                  </div>

                  {/* Answer With Animation */}
                  <motion.div
                    initial={false}
                    animate={isOpen ? "open" : "collapsed"}
                    variants={{
                      open: { height: "auto", opacity: 1, marginTop: 12 },
                      collapsed: { height: 0, opacity: 0, marginTop: 0 },
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="overflow-hidden text-left"
                  >
                    <p className="text-gray-600">{f.a}</p>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
