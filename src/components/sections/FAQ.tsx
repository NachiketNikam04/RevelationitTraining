"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

export interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Who are eligible to do course?",
    answer:
      "Any graduate student or final year graduate students are eligible (BA, BSC, BCS, B.Tech, B.E., MCA, MSC, M.Tech)",
  },

  {
    question: "Do I need a coding background to join the QA course?",
    answer:
      "Not at all. We start our manual testing modules from scratch, building your foundation before seamlessly transitioning into automation.",
  },
  {
    question: "Can final-year engineering students enroll before graduation?",
    answer:
      "Absolutely. We offer flexible schedules so you can upskill and prepare for corporate placements while finishing your final semester.",
  },
  {
    question: "How does the 100% placement assurance work?",
    answer:
      "Once you complete the curriculum and pass our internal mock interviews, our dedicated placement cell will route your resume to our hiring partners until you secure an offer.",
  },
  {
    question: "What tools will I master during the training?",
    answer:
      "Our stack is heavily aligned with current industry demands. You will master Manual testing, Selenium with Java, Playwright with JavaScript/TypeScript, API Testing with Postman, and CI/CD integrations.",
  },
  {
    question: "Do you provide support after I get the job?",
    answer:
      "Yes, as per your demands we will provide real on job support program ensures you have expert technical assistance during your first few months on the job to help you navigate live corporate projects confidently.",
  },
];

export interface FAQProps {
  items?: FAQItem[];
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  id?: string;
}

export function FAQ({
  items = faqs,
  eyebrow = "COMMON QUESTIONS",
  id = "faq",
}: FAQProps = {}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id={id} className="bg-brand-bg py-12 md:py-16 px-4 sm:px-6 relative">
      <div className="max-w-3xl mx-auto">
        {/* Header Design */}
        <div className="text-center mb-10 md:mb-12">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 text-brand-orange text-[13px] md:text-[14px] font-bold uppercase tracking-[0.2em]">
              {eyebrow}
            </span>
          </div>

          <h2 className="text-[36px] md:text-[44px] font-bold leading-[1.2] text-brand-dark tracking-tight">
            What <span className="text-brand-blue">Student</span> Ask before Enrolling.
          </h2>
        </div>

        {/* Hover-Accordion Item List */}
        <div className="space-y-4">
          {items.map((faq, index) => {
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={faq.question}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() =>
                  setHoveredIndex(hoveredIndex === index ? null : index)
                }
                className="group relative rounded-3xl transition-all duration-300"
              >
                {/* A. The Visible Question Pill */}
                <div
                  className={`relative w-full flex items-center justify-between p-3.5 sm:p-4 rounded-full transition-all duration-300 cursor-pointer select-none ${
                    isHovered
                      ? "bg-transparent border border-brand-dark shadow-sm"
                      : "bg-white/80 border border-brand-dark/10 shadow-xs hover:border-brand-dark/20"
                  }`}
                >
                  {/* Left Side (Number & Question Text) */}
                  <div className="flex items-center pr-4">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-brand-dark text-sm shadow-xs border border-brand-dark/5 flex-shrink-0">
                      0{index + 1}
                    </div>
                    <span className="ml-4 font-bold text-brand-dark text-[16px] md:text-[18px]">
                      {faq.question}
                    </span>
                  </div>

                  {/* Right Side (Rotating Dark Circle Icon) */}
                  <div className="w-10 h-10 bg-brand-dark rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-xs">
                    <motion.div
                      animate={{ rotate: isHovered ? 45 : 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="flex items-center justify-center"
                    >
                      <Plus className="w-5 h-5" />
                    </motion.div>
                  </div>
                </div>

                {/* B. The Expanding Answer Body */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                      animate={{ height: "auto", opacity: 1, marginTop: "1rem" }}
                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="text-brand-muted px-6 pb-6 text-[15px] md:text-[16px] font-normal leading-[1.6]">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}