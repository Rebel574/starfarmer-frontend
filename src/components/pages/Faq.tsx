import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'What is StarFarmer?',
    answer: 'StarFarmer is an agriculture-focused e-commerce platform that offers fertilizers, seeds, equipment, and more for farmers in multiple languages.',
  },
  {
    question: 'Do you deliver to rural areas?',
    answer: 'Yes, we deliver products across urban and rural locations. Delivery charges and availability may vary based on pin code.',
  },
  {
    question: 'How can I pay for my order?',
    answer: 'We support Cash on Delivery (COD) and secure online payments via PhonePe. Free shipping is available for online payments.',
  },
  {
    question: 'Is my information secure?',
    answer: 'Yes, your data is protected with encryption and never shared with third parties without consent.',
  },
  {
    question: 'Can I track my order?',
    answer: 'Yes, once your order is placed, you’ll receive updates and tracking details via email and your account dashboard.',
  },
];

const Faq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div
        className="absolute inset-0 bg-center bg-no-repeat bg-contain opacity-10 z-0"
        style={{ backgroundImage: "url('https://res.cloudinary.com/dxjgp7tyl/image/upload/v1745382823/Logo_opcdzi.png')" }}
      />
      <div className="relative z-20 max-w-4xl mx-auto px-6 py-10 text-gray-800">
        <h1 className="text-4xl font-bold text-teal-700 text-center mb-8">Frequently Asked Questions</h1>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-md"
            >
              <button
                onClick={() => toggleIndex(index)}
                className="flex justify-between items-center w-full text-left text-lg font-semibold text-green-800"
              >
                {faq.question}
                <ChevronDown
                  className={`w-5 h-5 text-green-500 transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <p className="mt-3 text-gray-600">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faq;
