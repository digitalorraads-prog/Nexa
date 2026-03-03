export default function DigitalMarketing() {
  return (
    <div className="bg-[#0c0c16] text-white overflow-hidden">

      {/* ================= HERO ================= */}
      <section className="relative py-24 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Grow Your Business with 
          <span className="text-cyan-400"> Digital Marketing</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto mb-8">
          We help brands increase traffic, generate leads, and boost sales 
          using data-driven marketing strategies.
        </p>
        <button className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-xl font-semibold transition">
          Get Free Consultation
        </button>
      </section>

      {/* ================= IMAGE SECTION ================= */}
      <section className="py-20 px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          
          <img
            src="https://images.unsplash.com/photo-1557838923-2985c318be48"
            alt="Digital Marketing Strategy"
            className="rounded-2xl shadow-lg hover:scale-105 transition duration-500"
          />

          <div>
            <h2 className="text-3xl font-bold mb-6">
              Result-Driven Strategies
            </h2>
            <p className="text-gray-400 mb-6">
              From SEO and paid ads to social media marketing, we create 
              custom strategies tailored to your business goals.
            </p>
            <ul className="space-y-3 text-gray-300">
              <li>✔ Search Engine Optimization (SEO)</li>
              <li>✔ Social Media Marketing</li>
              <li>✔ Google & Meta Ads</li>
              <li>✔ Conversion Optimization</li>
            </ul>
          </div>

        </div>
      </section>

      {/* ================= SECOND IMAGE SECTION ================= */}
      <section className="py-20 px-6 bg-[#111827]">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">

          <div>
            <h2 className="text-3xl font-bold mb-6">
              Increase Traffic & Sales
            </h2>
            <p className="text-gray-400 mb-6">
              We analyze your audience behavior and optimize campaigns 
              to maximize ROI and long-term growth.
            </p>
            <button className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-xl font-semibold transition">
              View Case Studies
            </button>
          </div>

          <img
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f"
            alt="Marketing Analytics"
            className="rounded-2xl shadow-lg hover:scale-105 transition duration-500"
          />

        </div>
      </section>

    </div>
  );
}
