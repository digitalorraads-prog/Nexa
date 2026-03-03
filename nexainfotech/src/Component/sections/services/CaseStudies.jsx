import { useEffect, useState } from "react";

function Stat({ number, text }) {
  const [count, setCount] = useState(0);

  // Extract numeric value (remove +, %, ★)
  const numericValue = parseFloat(number.replace(/[^0-9.]/g, ""));

  useEffect(() => {
    let start = 0;
    const duration = 2000; // animation duration (2 sec)
    const incrementTime = 20;
    const steps = duration / incrementTime;
    const increment = numericValue / steps;

    const timer = setInterval(() => {
      start += increment;

      if (start >= numericValue) {
        setCount(numericValue);
        clearInterval(timer);
      } else {
        setCount(parseFloat(start.toFixed(1)));
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [numericValue]);

  return (
    <div className="bg-[#0c0c16] p-8 rounded-2xl border border-cyan-500/10 hover:shadow-[0_0_20px_rgba(0,255,255,0.2)] transition transform hover:-translate-y-2 duration-300">
      <h3 className="text-4xl font-bold text-cyan-400 mb-2">
        {number.includes("%") && "+"}
        {count}
        {number.includes("%") && "%"}
        {number.includes("★") && "★"}
      </h3>
      <p className="text-gray-400">{text}</p>
    </div>
  );
}

export default function CaseStudies() {
  return (
    <section className="py-24 bg-[#111827] px-6 text-center text-white">
      <h2 className="text-3xl font-bold mb-16">Happy Client Results</h2>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <Stat number="+250%" text="Traffic Growth" />
        <Stat number="+180%" text="Lead Increase" />
        <Stat number="4.8★" text="Client Rating" />
      </div>
    </section>
  );
}
