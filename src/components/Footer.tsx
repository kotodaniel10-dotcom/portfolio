"use client";

import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9460 2.4189-2.1569 2.4189z" />
    </svg>
  );
}

export default function Footer() {
  const { dict, locale } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="contact" className="relative pt-32 pb-12 overflow-hidden">
      <div className="absolute top-0 inset-x-0 cyber-line" />
      <div className="absolute bottom-0 inset-x-0 w-full h-1/2 bg-gradient-to-t from-neon-cyan/[0.02] to-transparent" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* CTA Area */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            <span className="gradient-text">{dict.footer.title}</span>
          </h2>
          <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto mb-10">
            {dict.footer.subtitle}
          </p>

          {/* Discord CTA */}
          <motion.div
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl glass border border-[#5865F2]/20
                       hover:border-[#5865F2]/50 hover:shadow-[0_0_40px_rgba(88,101,242,0.15)]
                       transition-all duration-500 group cursor-default"
            whileHover={{ scale: 1.03, y: -3 }}
            whileTap={{ scale: 0.98 }}
          >
            <DiscordIcon className="w-7 h-7 text-[#5865F2] group-hover:drop-shadow-[0_0_15px_rgba(88,101,242,0.8)] transition-all duration-500" />
            <div className="text-start">
              <div className="text-xs text-gray-500 mb-0.5">
                {dict.footer.discordLabel}
              </div>
              <div className="text-lg font-mono font-bold text-[#5865F2] group-hover:text-white transition-colors duration-300">
                {dict.footer.discord}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="border-t border-white/[0.05] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>© {new Date().getFullYear()}</span>
            <span>{dict.footer.copyright}</span>
          </div>

          <div className="text-center">
            <div className="text-xs text-gray-700 font-mono">
              {dict.footer.madeWith}
            </div>
            <div className="text-[9px] text-gray-800 mt-1 font-mono italic">
              {locale === "en"
                ? "try typing the name of the one who inspires me..."
                : "...נסו להקליד את השם של מי שנותנת לי השראה"}
            </div>
          </div>

          <motion.button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-neon-cyan transition-colors group"
            whileHover={{ y: -2 }}
          >
            <span>{dict.footer.backToTop}</span>
            <ArrowUp
              size={14}
              className="group-hover:-translate-y-1 transition-transform"
            />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
