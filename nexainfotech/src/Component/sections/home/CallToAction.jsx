import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export default function CallToAction({
  location = "Globally",  // Default value
  title = "Ready to Scale Your Business",
  description = "Let's create powerful digital strategies that drive real growth"
}) {
  return (
    <section className="relative py-12 md:py-16 bg-[#0a0f1c] text-white text-center overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 blur-3xl opacity-50" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-sm font-semibold tracking-wide mb-6">
            ✨ Your Success Starts Here
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-snug max-w-3xl mx-auto">
            {title}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              {location}?
            </span>
          </h2>

          <p className="text-base md:text-lg text-gray-300 mb-8 max-w-2xl mx-auto font-light leading-relaxed">
            {description} <span className="text-white font-medium">{location}</span>.
            Join hundreds of forward-thinking companies building the future with us.
          </p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/contact"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]"
            >
              Get Free Consultation
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}