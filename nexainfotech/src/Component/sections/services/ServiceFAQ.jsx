// Component/sections/services/ServiceFAQ.jsx
import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export default function ServiceFAQ({ serviceType, location, isLocationBased }) {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: `What ${serviceType} services do you offer ${isLocationBased ? `in ${location}` : ''}?`,
      answer: `We offer comprehensive ${serviceType.toLowerCase()} solutions tailored to your business needs, including strategy development, execution, and optimization.`
    },
    {
      question: `How long does it take to see results from ${serviceType}?`,
      answer: `Results vary based on your specific goals and current market position. Typically, clients start seeing improvements within 2-3 months of consistent effort.`
    },
    {
      question: `Do you work with businesses of all sizes?`,
      answer: `Yes! We work with startups, SMEs, and large enterprises, customizing our approach to fit your budget and requirements.`
    },
    {
      question: `What makes your ${serviceType} services different?`,
      answer: `Our data-driven approach, experienced team, and commitment to ROI make us stand out. We don't just deliver services; we deliver results.`
    },
    {
      question: `Can I get a custom package for my business?`,
      answer: `Absolutely! We create custom packages based on your specific needs, goals, and budget.`
    }
  ];

  return (
    <div className="py-16 bg-[#11111f]">
      <div className="container mx-auto px-5 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400">
            Everything you need to know about our {serviceType.toLowerCase()} services
            {isLocationBased && ` in ${location}`}
          </p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-[#1a1a2e] rounded-xl border border-gray-800">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center"
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              >
                <span className="font-semibold">{faq.question}</span>
                <ChevronDownIcon className={`w-5 h-5 transition-transform ${openIndex === index ? 'rotate-180' : ''}`} />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-gray-400">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
