import React from "react";
import Title from "../components/Title";

const PrivacyPolicy = () => {
  return (
    <div className="px-4 mt-24 sm:px-[6vw] md:px-[8vw] lg:px-[10vw] pt-12 pb-24 bg-white min-h-[80vh]">
      <div className="text-center sm:text-left mb-12">
        <Title text1={"PRIVACY"} text2={"POLICY"} />
        <p className="text-xs text-gray-400 tracking-widest uppercase mt-1">
          How we protect and manage your personal data
        </p>
      </div>

      <div className="max-w-4xl mx-auto flex flex-col gap-8 text-sm text-gray-600 leading-relaxed font-light">
        <section className="space-y-3">
          <h2 className="font-serif text-xl text-gray-900 font-medium">1. Information We Collect</h2>
          <p>
            At KHYOOT, we collect personal information that you provide directly to us when creating an account, making a purchase, or contacting our customer service. This includes your name, email address, shipping address, phone number, and payment details.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl text-gray-900 font-medium">2. How We Use Your Information</h2>
          <p>
            We use the information we collect to process your transactions, fulfill your orders, send order updates, and provide an elevated, personalized shopping experience. Your data also helps us improve our website security and customer support.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl text-gray-900 font-medium">3. Data Protection & Security</h2>
          <p>
            We implement advanced security measures, including encryption and secure server protocols, to ensure your personal information remains confidential and protected against unauthorized access or disclosure.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl text-gray-900 font-medium">4. Contact Us</h2>
          <p>
            If you have any questions or concerns regarding our privacy practices, please feel free to reach out to our support team through our contact page.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;