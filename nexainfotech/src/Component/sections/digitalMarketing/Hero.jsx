export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-6">
      <div className="absolute inset-0 bg-linear-to-br from-[#004C7D]/30 via-[#0c0c16] to-[#158EB0]/20"></div>

      <div className="relative z-10 max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-linear-to-r from-[#158EB0] to-cyan-400 bg-clip-text text-transparent">
          Digital Marketing That Drives Real Growth
        </h1>

        <p className="text-gray-400 text-lg mb-8">
          We help businesses grow with data-driven strategies.
        </p>
      </div>
    </section>
  );
}
