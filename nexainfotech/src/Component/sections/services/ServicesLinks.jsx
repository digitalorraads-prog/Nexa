import { Link } from "react-router-dom";
import {
  BarChart3,
  Megaphone,
  Palette,
  Globe,
  Code,
  Target,
  ArrowRight,
} from "lucide-react";

export default function ServicesLinks() {

  const services = [
    {
      title: "Digital Marketing",
      slug: "digital-marketing",
      description:
        "Complete online marketing strategies to grow your business.",
      icon: BarChart3,
    },
    {
      title: "Graphic Designing",
      slug: "graphic-designing",
      description:
        "Creative branding, logos, and visual identity solutions.",
      icon: Palette,
    },
    {
      title: "Social Media Marketing",
      slug: "social-media-marketing",
      description:
        "Build strong engagement and brand presence.",
      icon: Megaphone,
    },
    {
      title: "SEO Optimization",
      slug: "seo-optimization",
      description:
        "Improve rankings and drive organic traffic.",
      icon: Globe,
    },
    {
      title: "Web Development",
      slug: "web-development",
      description:
        "Modern, responsive and high-converting websites.",
      icon: Code,
    },
    {
      title: "PPC Advertising",
      slug: "ppc-advertising",
      description:
        "High-performing paid campaigns with measurable ROI.",
      icon: Target,
    },
  ];

  return (
    <section className="py-24 bg-[#0c0c16] px-6 text-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          Our Core Services
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <Link
                key={index}
                to={`/services/${service.slug}`}
                className="group relative bg-[#111827] p-8 rounded-2xl border border-cyan-500/10 
                hover:border-cyan-400/40 
                hover:shadow-[0_0_25px_rgba(0,255,255,0.15)]
                transition-all duration-500 
                hover:-translate-y-2"
              >
                {/* Icon */}
                <div className="mb-5 text-cyan-400 group-hover:scale-110 transition duration-500">
                  <Icon size={40} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold mb-3 group-hover:text-cyan-400 transition">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm mb-6">
                  {service.description}
                </p>

                {/* Arrow */}
                <div className="flex items-center gap-2 text-cyan-400 font-medium">
                  Learn More
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-2 transition duration-300"
                  />
                </div>

                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#004C7D]/0 to-[#158EB0]/0 group-hover:from-[#004C7D]/10 group-hover:to-[#158EB0]/10 transition duration-500 -z-10"></div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
