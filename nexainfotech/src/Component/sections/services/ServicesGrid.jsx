import { BarChart3, Megaphone, Globe, Target } from "lucide-react";
import ServiceCard from "./components/ServiceCard";

export default function ServicesGrid() {
  return (
    <section className="py-20 px-6 max-w-6xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">
        Our Digital Marketing Services
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <ServiceCard icon={<BarChart3 size={40} />} title="SEO" desc="Rank higher on Google." />
        <ServiceCard icon={<Megaphone size={40} />} title="Social Media" desc="Build engagement." />
        <ServiceCard icon={<Globe size={40} />} title="Google Ads" desc="High converting PPC." />
        <ServiceCard icon={<Target size={40} />} title="Conversion" desc="Maximize ROI." />
      </div>
    </section>
  );
}
