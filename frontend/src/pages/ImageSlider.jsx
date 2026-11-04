import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import image1 from '../assets/frontend_assets/image1.jpeg';
import image2 from '../assets/frontend_assets/image2.jpeg';
import image3 from '../assets/frontend_assets/image3.jpeg';
import image4 from '../assets/frontend_assets/image4.jpeg';

// --- Slides Data with All 4 Images ---
const slides = [
    { url: image1, title: 'KHYOOT WINTER HOODIE' },
    { url: image2, title: 'KHYOOT BABETEES' },
    { url: image3, title: 'KHYOOT ARABIAN WEAVE' },
    { url: image4, title: 'KHYOOT BALACLAVA' },
];

const ImageSlider = ({ autoPlay = true, interval = 5000 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
    };

    const goToSlide = (slideIndex) => {
        setCurrentIndex(slideIndex);
    };

    // Auto-Play Logic
    useEffect(() => {
        if (!autoPlay) return;
        const timer = setInterval(goToNext, interval);
        return () => clearInterval(timer);
    }, [autoPlay, interval]);

    // Style object for the main slide using background image
    const slideStyles = {
        backgroundImage: `url(${slides[currentIndex].url})`,
    };

    return (
        <div className="relative w-full h-[70vh] sm:h-[80vh] lg:h-[85vh] overflow-hidden bg-gray-950 mt-20">
            {/* Main Slide Area with Background Cover and Center Focus */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 ease-out transform" 
                style={slideStyles}
            >
                {/* Dark Luxury Gradient Overlay for Perfect Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30 backdrop-brightness-90" />

                {/* Text Overlay and Button */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 z-10">
                    <span className="text-white/70 text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase mb-3 animate-fade-in">
                        New Collection 2026
                    </span>
                    <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-widest text-white drop-shadow-2xl mb-8 uppercase max-w-4xl">
                        {slides[currentIndex].title}
                    </h2>
                    <NavLink 
                        to="/Collection" 
                        className="px-8 sm:px-10 py-4 bg-white text-black font-bold tracking-[0.2em] text-xs sm:text-sm rounded-full shadow-2xl hover:bg-black hover:text-white transition-all duration-300 transform hover:-translate-y-1 border border-white uppercase"
                    >
                        SHOP NOW
                    </NavLink>
                </div>
            </div>
            
            {/* Navigation Arrows and Dots (Positioned at the bottom) */}
            <div className="absolute bottom-6 left-0 right-0 flex items-center justify-between px-6 sm:px-12 z-20 max-w-7xl mx-auto">
                
                {/* Left Arrow */}
                <button 
                    onClick={goToPrevious} 
                    className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center cursor-pointer hover:bg-white hover:text-black transition-all duration-300 shadow-xl border border-white/20 focus:outline-none"
                    aria-label="Previous Slide"
                >
                    &#8592;
                </button>
                
                {/* Dot Navigation with High-End Pill Design */}
                <div className="flex items-center gap-2 sm:gap-3 bg-black/40 backdrop-blur-md px-4 sm:px-5 py-2.5 rounded-full border border-white/10 shadow-xl overflow-x-auto max-w-[60vw] sm:max-w-none">
                    {slides.map((slide, slideIndex) => (
                        <div
                            key={slideIndex}
                            onClick={() => goToSlide(slideIndex)}
                            className={`h-2.5 rounded-full transition-all duration-500 cursor-pointer flex-shrink-0 ${
                                slideIndex === currentIndex 
                                    ? 'w-8 bg-white shadow-md' 
                                    : 'w-2.5 bg-white/40 hover:bg-white/70'
                            }`}
                        />
                    ))}
                </div>
                
                {/* Right Arrow */}
                <button 
                    onClick={goToNext} 
                    className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center cursor-pointer hover:bg-white hover:text-black transition-all duration-300 shadow-xl border border-white/20 focus:outline-none"
                    aria-label="Next Slide"
                >
                    &#8594;
                </button>
            </div>
        </div>
    );
};

export default ImageSlider;