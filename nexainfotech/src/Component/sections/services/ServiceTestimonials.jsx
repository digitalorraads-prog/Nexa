// Component/sections/services/ServiceTestimonials.jsx
export default function ServiceTestimonials({ serviceType, location, isLocationBased }) {
  const testimonials = [
    {
      name: "John Smith",
      company: "Tech Corp",
      text: `Amazing ${serviceType} services! They transformed our online presence completely.`,
      rating: 5
    },
    {
      name: "Sarah Johnson",
      company: "StartUp Inc",
      text: `Best decision we made for our business. Professional team and excellent results.`,
      rating: 5
    },
    {
      name: "Mike Brown",
      company: "Local Business",
      text: `Their expertise in ${serviceType} helped us grow faster than ever before.`,
      rating: 5
    }
  ];

  return (
    <div className="py-16">
      <div className="container mx-auto px-5">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Client Success Stories
            {isLocationBased && <span className="text-cyan-400"> from {location}</span>}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            What our clients say about our {serviceType.toLowerCase()} services
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-[#1a1a2e] p-6 rounded-xl border border-gray-800">
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-gray-300 mb-4">"{testimonial.text}"</p>
              <div>
                <p className="font-bold">{testimonial.name}</p>
                <p className="text-sm text-gray-400">{testimonial.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
