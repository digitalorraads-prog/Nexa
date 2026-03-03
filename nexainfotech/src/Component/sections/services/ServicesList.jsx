import { ArrowRight } from "lucide-react";

export default function ServicesList() {
  const services = [
    "SEO Optimization",
    "Social Media Marketing",
    "Google Ads (PPC)",
    "Web Development",
  ];

  return (
    <section className="py-24 px-6 max-w-6xl mx-auto text-white">
      <h2 className="text-3xl font-bold mb-12 text-center">
        Our Core Services
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        {services.map((item, i) => (
          <div
            key={i}
            className="bg-[#111827] p-6 rounded-2xl border border-cyan-500/10 hover:border-cyan-400/40 hover:shadow-[0_0_20px_rgba(0,255,255,0.15)] transition"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">{item}</h3>
              <ArrowRight className="text-cyan-400" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
