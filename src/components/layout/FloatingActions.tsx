"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import WhatsappIcon from "@hugeicons/core-free-icons/WhatsappIcon";
import CallIcon from "@hugeicons/core-free-icons/CallIcon";

export function FloatingActions() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function toggleVisibility() {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    }

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    // Check initial scroll state
    toggleVisibility();

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed bottom-6 right-6 z-[100] flex flex-col items-center gap-3"
      >
        {/* A. WhatsApp Button */}
        <a
          href="https://wa.me/917558339190"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp (+91 7558339190)"
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative group bg-[#25D366] text-white"
        >
          <HugeiconsIcon icon={WhatsappIcon} size={24} />

          {/* Tooltip */}
          <span className="absolute right-14 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black text-white text-xs px-2.5 py-1 rounded whitespace-nowrap pointer-events-none shadow-md">
            WhatsApp: +91 7558339190
          </span>
        </a>

        {/* B. Call Button */}
        <a
          href="tel:+917558339190"
          aria-label="Call us (+91 7558339190)"
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative group bg-brand-orange text-white"
        >
          <HugeiconsIcon icon={CallIcon} size={22} />

          {/* Tooltip */}
          <span className="absolute right-14 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black text-white text-xs px-2.5 py-1 rounded whitespace-nowrap pointer-events-none shadow-md">
            Call: +91 7558339190
          </span>
        </a>

        {/* C. Scroll to Top Button (Conditional) */}
        <AnimatePresence>
          {isVisible && (
            <motion.button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              initial={{ opacity: 0, scale: 0.6, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.6, y: 10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative group bg-white border border-gray-200 text-brand-dark hover:border-brand-dark/40"
            >
              <ArrowUp className="w-5 h-5" />

              {/* Tooltip */}
              <span className="absolute right-14 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black text-white text-xs px-2.5 py-1 rounded whitespace-nowrap pointer-events-none shadow-md">
                Back to top
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}