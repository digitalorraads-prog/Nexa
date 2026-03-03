import { Link } from "react-router-dom";

export default function CallToAction({ 
  location = "Globally",  // Default value
  title = "Ready to Scale Your Business",
  description = "Let's create powerful digital strategies that drive real growth"
}) {
  return (
    <section className="relative py-14 bg-gradient-to-r from-[#158EB0] to-[#004C7D] text-white text-center overflow-hidden">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

      <div className="relative max-w-4xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
          {title} {location}?
        </h2>

        <p className="text-lg md:text-xl mb-8 text-white/90">
          {description} {location}.
        </p>

        <Link 
          to="/contact" 
          className="px-8 py-4 rounded-full bg-white text-black font-bold text-lg
          transition-all duration-300 hover:scale-105 hover:shadow-2xl inline-block"
        >
          Get Free Consultation
        </Link>
      </div>
    </section>
  );
}