import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

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
    <section className="bg-white py-16 md:py-24">
      <div className="container max-w-7xl px-6 text-center">
        <h3 className="text-3xl md:text-4xl font-bold mb-12 text-slate-800">
          Frequently Asked Questions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center">
          {faqs.map((f, i) => {
            const isOpen = openIndex === i;

            return (
              <div
                key={i}
                onClick={() => toggleFAQ(i)}
                className={`cursor-pointer bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm transition-all duration-300
                  hover:shadow-lg hover:scale-[1.02]
                  ${isOpen ? "shadow-md scale-[1.02]" : ""}
                `}
              >
                {/* Question Row */}
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-800 text-left">{f.q}</p>

                  <ChevronDown
                    size={20}
                    className={`transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-blue-600" : "rotate-0 text-slate-600"
                    }`}
                  />
                </div>

                {/* Answer With Animation */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-40 mt-3" : "max-h-0"
                  }`}
                >
                  <p className="text-gray-600 text-left">{f.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
