// Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const footerLinks = [
    { 
      title: "Quick Links", 
      links: [
        { name: "Home", path: "/" },
        { name: "Collection", path: "/collection" },
        { name: "About Us", path: "/about" },
        { name: "Contact", path: "/contact" },
      ]
    },
    { 
      title: "Customer Service", 
      links: [
        { name: "FAQ", path: "/faq" },
        { name: "Privacy Policy", path: "/privacy" },
      ]
    },
    { 
      title: "My Account", 
      links: [
        { name: "My Cart", path: "/cart" },
        { name: "Track Order", path: "/orders" },
        { name: "Login/Register", path: "/login" },
      ]
    },
  ];

  return (
    <footer className="bg-[#003459] text-white pt-20 border-t border-sky-900/50 footer relative overflow-hidden">
      
      {/* Background Subtle Glow Accent */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 border-b border-sky-800/60 pb-16">
          
          {/* 1. Brand Info & Social Media (Span 2 columns on desktop) */}
          <div className="lg:col-span-2 space-y-5 pr-4">
            <Link to="/" className="text-4xl sm:text-5xl font-extrabold tracking-wider inline-block text-white">
              KHYOOT
            </Link>
            <p className="text-sky-100/70 text-sm sm:text-base max-w-sm leading-relaxed font-light">
              Your ultimate destination for the latest trends in luxury fashion and accessories. Quality and style guaranteed.
            </p>
            
            {/* Social Media Icons with Luxury Containers */}
            <div className="flex items-center space-x-3 pt-2">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1" 
                aria-label="Tiktok"
              >
                <img className="w-5 h-5 filter brightness-200 invert" src="src/assets/frontend_assets/tik-tok.png" alt="TikTok" />
              </a>
              
              <a 
                href="https://www.instagram.com/khyoot_eg/" 
                target='_blank' 
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1" 
                aria-label="Instagram"
              >
                <img className="w-5 h-5 filter brightness-200 invert" src="src/assets/frontend_assets/instagram.png" alt="Instagram" />
              </a>
            </div>
          </div>
          
          {/* 2. Link Groups */}
          {footerLinks.map((section, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-base font-bold uppercase tracking-wider text-white border-l-2 border-sky-400 pl-3">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      to={link.path} 
                      className="text-sky-100/70 hover:text-white hover:translate-x-1 transition-all duration-300 text-sm inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* 3. Contact Info Column */}
          <div className="space-y-4">
            <h3 className="text-base font-bold uppercase tracking-wider text-white border-l-2 border-sky-400 pl-3">
              Contact Info
            </h3>
            <div className="text-sky-100/70 space-y-3 text-sm font-light">
              <p className="flex items-start leading-relaxed">
                <svg className="w-5 h-5 mr-2.5 text-sky-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                Mansoura, Dakahlia, Egypt
              </p>
              <p className="flex items-center">
                <svg className="w-5 h-5 mr-2.5 text-sky-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                support@khyoot.com
              </p>
              <p className="flex items-center">
                <svg className="w-5 h-5 mr-2.5 text-sky-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.79 21 3 14.21 3 6V5z"/></svg>
                +20 100 123 4567
              </p>
            </div>
          </div>

        </div>
        
        {/* Footer Bottom Bar (Copyright & Developer Credit) */}
        <div className="py-8 flex flex-col sm:flex-row items-center justify-between text-sky-100/60 text-xs sm:text-sm">
          <p>&copy; {new Date().getFullYear()} KHYOOT. All rights reserved.</p>
          <p className="mt-3 sm:mt-0">
            Designed & Developed by <a className="text-white font-medium underline hover:text-sky-300 transition-colors" target='_blank' rel="noreferrer" href="https://elattar-portfolio-6zgw.vercel.app/">Mohamed Elattar</a>
          </p>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;