// Component/sections/services/RelatedServices.jsx
import { Link } from "react-router-dom";

export default function RelatedServices({ currentService, location, isLocationBased }) {
  const relatedServices = [
    { name: "Digital Marketing", icon: "📱", slug: "digital-marketing" },
    { name: "SEO Optimization", icon: "🔍", slug: "seo-optimization" },
    { name: "Web Development", icon: "💻", slug: "web-development" },
    { name: "Social Media", icon: "📲", slug: "social-media-marketing" }
  ].filter(s => s.name !== currentService);

  return (
    <div className="py-16">
      <div className="container mx-auto px-5">
        <h2 className="text-3xl font-bold mb-8 text-center">Related Services</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {relatedServices.map((service, index) => (
            <Link
              key={index}
              to={isLocationBased ? `/services/${location.toLowerCase().replace(' ', '-')}/${service.slug}` : `/services/${service.slug}`}
              className="bg-[#1a1a2e] p-6 rounded-xl border border-gray-800 hover:border-cyan-400/50 text-center group"
            >
              <span className="text-4xl mb-2 block">{service.icon}</span>
              <h3 className="font-semibold group-hover:text-cyan-400">{service.name}</h3>
              {isLocationBased && <p className="text-xs text-gray-500 mt-1">in {location}</p>}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
