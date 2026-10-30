import React from 'react';
import exchangeIcon from '../assets/frontend_assets/exchange_icon.png';
import qualityIcon from '../assets/frontend_assets/quality_icon.png';
import supportIcon from '../assets/frontend_assets/support_img.png';

const OurPolicy = () => {
  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 overflow-hidden">
      
      {/* Background Decorative Glow (Luxury Touch) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
        <div className="w-[500px] h-[200px] bg-gradient-to-r from-blue-100/50 to-purple-100/50 blur-3xl rounded-full" />
      </div>

      {/* Main Container with Scroll-triggered Fade & Slide Effect */}
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-800">
        
        {/* Feature 1: Easy Exchange Policy */}
        <div className="group relative bg-white/70 backdrop-blur-xl border border-gray-100 p-8 rounded-3xl shadow-xl shadow-black/[0.03] hover:shadow-2xl hover:shadow-black/[0.08] transition-all duration-500 transform hover:-translate-y-2 text-center animate-fade-in-up">
          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-2xl bg-[#003459] shadow-inner transition-colors duration-500">
            <img 
              src={exchangeIcon} 
              className="w-8 h-8 object-contain brightness-200 invert transition-all duration-500" 
              alt="Exchange Icon" 
            />
          </div>
          <h3 className="font-bold text-lg tracking-wide mb-2 text-gray-900">Easy Exchange Policy</h3>
          <p className="text-sm text-gray-500 font-medium leading-relaxed">We offer hassle free exchange policy</p>
        </div>

        {/* Feature 2: 7 Days Return Policy */}
        <div className="group relative bg-white/70 backdrop-blur-xl border border-gray-100 p-8 rounded-3xl shadow-xl shadow-black/[0.03] hover:shadow-2xl hover:shadow-black/[0.08] transition-all duration-500 transform hover:-translate-y-2 text-center animate-fade-in-up delay-150">
          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-2xl bg-[#003459] shadow-inner transition-colors duration-500">
            <img 
              src={qualityIcon} 
              className="w-8 h-8 object-contain brightness-200 invert transition-all duration-500" 
              alt="Quality Icon" 
            />
          </div>
          <h3 className="font-bold text-lg tracking-wide mb-2 text-gray-900">7 Days Return Policy</h3>
          <p className="text-sm text-gray-500 font-medium leading-relaxed">We provide 7 days free return policy</p>
        </div>

        {/* Feature 3: Best Customer Support */}
        <div className="group relative bg-white/70 backdrop-blur-xl border border-gray-100 p-8 rounded-3xl shadow-xl shadow-black/[0.03] hover:shadow-2xl hover:shadow-black/[0.08] transition-all duration-500 transform hover:-translate-y-2 text-center animate-fade-in-up delay-300">
          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-2xl bg-[#003459] shadow-inner transition-colors duration-500">
            <img 
              src={supportIcon} 
              className="w-8 h-8 object-contain brightness-200 invert transition-all duration-500" 
              alt="Support Icon" 
            />
          </div>
          <h3 className="font-bold text-lg tracking-wide mb-2 text-gray-900">Best customer support</h3>
          <p className="text-sm text-gray-500 font-medium leading-relaxed">We provide 24/7 customer support</p>
        </div>

      </div>
    </section>
  );
};

export default OurPolicy;