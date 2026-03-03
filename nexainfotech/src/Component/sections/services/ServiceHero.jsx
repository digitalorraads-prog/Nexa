export default function ServiceHero() {
  return (
    <section className="pt-28 pb-10 text-center relative text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-[#004C7D]/30 via-[#0c0c16] to-[#158EB0]/20"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#158EB0] to-cyan-400 bg-clip-text text-transparent">
          Our Services
        </h1>

        <p className="text-gray-400 mb-8">
         We provide full-scale digital solutions to grow your business globally.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <button className="px-6 py-3 bg-gradient-to-r from-[#004C7D] to-[#158EB0] rounded-full font-semibold hover:-translate-y-1 transition">
            Get Free Audit
          </button>
          <button className="px-6 py-3 border border-cyan-500/40 rounded-full hover:bg-cyan-500 hover:text-black transition">
            View Case Studies
          </button>
        </div>
      </div>
    </section>
  );
}
