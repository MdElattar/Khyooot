import React, { useState } from "react";
import Title from "../components/Title";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is the estimated delivery time?",
      answer: "We offer complimentary express shipping worldwide. Orders within Egypt typically arrive within 2-3 business days, while international orders take between 5-7 business days."
    },
    {
      question: "What is your return and exchange policy?",
      answer: "We accept returns and exchanges within 14 days of delivery. Items must be unworn, unwashed, and in their original packaging with all tags attached."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order is shipped, you will receive a confirmation email with a tracking number. You can also track your order directly from the 'My Orders' section in your account."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), Apple Pay, and Cash on Delivery (COD) for eligible regions."
    },
    {
      question: "How do I care for KHYOOT luxury garments?",
      answer: "We recommend dry cleaning or gentle cold hand washing for all our luxury pieces to preserve the integrity of the premium fabrics."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="px-4 mt-24 sm:px-[6vw] md:px-[8vw] lg:px-[10vw] pt-12 pb-24 bg-white min-h-[80vh]">
      <div className="text-center sm:text-left mb-12">
        <Title text1={"CUSTOMER"} text2={"SERVICE - FAQ"} />
        <p className="text-xs text-gray-400 tracking-widest uppercase mt-1">
          Frequently asked questions about our services and products
        </p>
      </div>

      <div className="max-w-3xl mx-auto flex flex-col gap-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-100 rounded-2xl p-6 bg-gray-50/50 transition-all duration-300 hover:border-gray-300"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center text-left font-serif text-lg text-gray-900 focus:outline-none"
            >
              <span>{faq.question}</span>
              <span className="text-xl font-light text-gray-500 transition-transform duration-300">
                {openIndex === index ? "−" : "+"}
              </span>
            </button>
            {openIndex === index && (
              <p className="mt-4 text-sm text-gray-600 leading-relaxed font-light border-t border-gray-100 pt-4">
                {faq.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;