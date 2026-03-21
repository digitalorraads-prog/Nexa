export default function ServicesRibbon() {
  const services = [
    "Web Development",
    "Video Editing",
    "Graphic Design",
    "Digital Marketing",
  ];

  return (
    <>
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }

          .marquee {
            animation: marquee 25s linear infinite;
          }

          .marquee:hover {
            animation-play-state: paused;
          }
        `}
      </style>

      <div className="relative overflow-hidden bg-[#0c0c16] py-6 border-y border-white/10">
        {/* Left Gradient */}
        <div className="absolute left-0 top-0 h-full w-32 bg-linear-to-r from-[#0c0c16] to-transparent z-10"></div>

        {/* Right Gradient */}
        <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-[#0c0c16] to-transparent z-10"></div>

        <div className="marquee whitespace-nowrap flex gap-16 text-xl font-semibold text-white">
          {[...services, ...services].map((item, index) => (
            <span
              key={index}
              className="flex items-center gap-4 hover:text-cyan-400 transition duration-300"
            >
              <span className="text-cyan-400">✦</span> {item}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
