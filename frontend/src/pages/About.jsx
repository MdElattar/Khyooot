import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const FadeInSection = ({ children, delay = "" }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${delay} ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {children}
    </div>
  );
};
 
const About = () => {
  return (
    <main className="w-full bg-white text-gray-900 overflow-hidden pt-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full bg-[#003459] text-white py-32 px-6 lg:px-16 overflow-hidden">
        {/* Subtle Background Glow Accent */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 text-center sm:text-left">
          <FadeInSection>
            <span className="inline-block mb-6 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] bg-white/10 border border-white/20 rounded-full text-sky-200 backdrop-blur-md">
              Made with Pride in Egypt 🇪🇬
            </span>
          </FadeInSection>

          <FadeInSection>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] max-w-4xl">
              Threads of identity, <br />
              <span className="text-sky-300 font-light italic">woven with purpose.</span>
            </h1>
          </FadeInSection>

          <FadeInSection>
            <p className="mt-6 text-base sm:text-lg text-sky-100/80 max-w-2xl font-light leading-relaxed">
              Khyoot blends rich Egyptian heritage with modern luxury design to create meaningful, locally crafted fashion pieces that speak for themselves.
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* 2. ABOUT NARRATIVE SECTION */}
      <section className="max-w-5xl mx-auto px-6 py-28">
        <FadeInSection>
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-gray-400 block mb-2">Our Story</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-wide uppercase">About KHYOOT</h2>
            <div className="w-16 h-[2px] bg-gray-900 mx-auto mt-4" />
          </div>
        </FadeInSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <FadeInSection>
            <div className="space-y-6 text-base sm:text-lg text-gray-600 leading-relaxed font-light">
              <p>
                <strong className="font-bold text-gray-900">Khyoot</strong> is a premier local Egyptian brand inspired by our deep cultural heritage and driven by contemporary fashion aesthetics.
              </p>
              <p>
                Meaning <em className="text-gray-900 font-medium">“threads”</em> in Arabic, Khyoot connects timeless tradition with modern innovation through ethically made, premium crafted garments.
              </p>
              <p className="font-semibold text-gray-900 text-xl pt-2 border-l-2 border-[#003459] pl-4 italic">
                “Khyoot isn’t just fashion — it’s identity, woven.”
              </p>
            </div>
          </FadeInSection>

          <FadeInSection>
            <div className="bg-gray-50 border border-gray-100 p-8 sm:p-10 rounded-3xl shadow-xl shadow-black/[0.03] space-y-4">
              <h3 className="text-xl font-bold text-gray-900">The Philosophy</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                We celebrate master Egyptian craftsmanship by blending ancient cultural roots with clean, modern silhouettes—creating unique pieces that honor our history while defining the future of streetwear and luxury.
              </p>
              <div className="pt-4">
                <Link to="/collection" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#003459] hover:text-black transition-colors">
                  Explore Latest Collection →
                </Link>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* 3. CORE VALUES SECTION */}
      <section className="bg-gray-50 py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-16">
              <span className="text-xs font-bold tracking-[0.25em] uppercase text-gray-400 block mb-2">What Drives Us</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-wide uppercase">Our Core Values</h2>
              <div className="w-16 h-[2px] bg-gray-900 mx-auto mt-4" />
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FadeInSection>
              <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-lg shadow-black/[0.02] hover:-translate-y-2 transition-all duration-300 text-center group">
                <div className="w-14 h-14 bg-sky-50 text-[#003459] rounded-2xl flex items-center justify-center text-2xl mx-auto mb-6 group-hover:bg-[#003459] group-hover:text-white transition-colors">
                  🧵
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Craftsmanship</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Every garment is thoughtfully constructed with meticulous attention to detail, honoring traditional Egyptian artistry.
                </p>
              </div>
            </FadeInSection>

            <FadeInSection>
              <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-lg shadow-black/[0.02] hover:-translate-y-2 transition-all duration-300 text-center group">
                <div className="w-14 h-14 bg-sky-50 text-[#003459] rounded-2xl flex items-center justify-center text-2xl mx-auto mb-6 group-hover:bg-[#003459] group-hover:text-white transition-colors">
                  🏛️
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Identity</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Our designs tell powerful stories inspired by our culture, roots, and authentic personal expression.
                </p>
              </div>
            </FadeInSection>

            <FadeInSection>
              <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-lg shadow-black/[0.02] hover:-translate-y-2 transition-all duration-300 text-center group">
                <div className="w-14 h-14 bg-sky-50 text-[#003459] rounded-2xl flex items-center justify-center text-2xl mx-auto mb-6 group-hover:bg-[#003459] group-hover:text-white transition-colors">
                  🌿
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Sustainability</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Locally produced, ethically manufactured, and consciously designed for a responsible and enduring future.
                </p>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE KHYOOT */}
      <section className="py-28 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-16">
              <span className="text-xs font-bold tracking-[0.25em] uppercase text-gray-400 block mb-2">The Difference</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-wide uppercase">Why Choose Khyoot</h2>
              <div className="w-16 h-[2px] bg-gray-900 mx-auto mt-4" />
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FadeInSection>
              <div className="p-8 sm:p-10 border border-gray-100 bg-gray-50/50 rounded-3xl text-center hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold mb-3 text-gray-900">Authentic Heritage</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Rooted deeply in Egyptian culture, creating timeless apparel infused with genuine meaning.
                </p>
              </div>
            </FadeInSection>

            <FadeInSection>
              <div className="p-8 sm:p-10 border border-gray-100 bg-gray-50/50 rounded-3xl text-center hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold mb-3 text-gray-900">Contemporary Edge</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Merging classic cultural elements with high-end modern streetwear trends.
                </p>
              </div>
            </FadeInSection>

            <FadeInSection>
              <div className="p-8 sm:p-10 border border-gray-100 bg-gray-50/50 rounded-3xl text-center hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold mb-3 text-gray-900">Purpose-Driven</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Committed to empowering local manufacturing and ethical sustainable practices.
                </p>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION BANNER */}
      <section className="bg-[#003459] text-white py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <FadeInSection>
            <h2 className="text-3xl sm:text-4xl font-black tracking-wide uppercase">Experience The Collection</h2>
            <p className="text-sky-100/70 text-sm sm:text-base max-w-xl mx-auto mt-3 font-light">
              Discover our latest drops and wear your identity with pride.
            </p>
            <div className="pt-4">
              <Link
                to="/collection"
                className="inline-block bg-white text-[#003459] hover:bg-black hover:text-white px-10 py-4 rounded-full font-bold uppercase tracking-wider text-xs transition-all duration-300 shadow-xl"
              >
                Shop Now
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>

    </main>
  );
};

export default About;