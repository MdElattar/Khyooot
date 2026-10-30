import React, { useState, useEffect } from 'react';

const ScrollArrow = () => {
    // State to track whether the arrow should be visible
    const [isVisible, setIsVisible] = useState(false);

    // Function to scroll the window to the top smoothly
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Makes the scroll a smooth animation
        });
    };

    // Effect to manage visibility based on scroll position
    useEffect(() => {
        // Function to run on every scroll event
        const toggleVisibility = () => {
            // Show the button if the user has scrolled down more than 300px
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        // Attach the event listener when the component mounts
        window.addEventListener('scroll', toggleVisibility);

        // Clean up the event listener when the component unmounts
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []); // Empty dependency array ensures it runs only once on mount

    return (
        <div 
            className={`fixed bottom-6 right-6 z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        >
            <button 
                onClick={scrollToTop} 
                className="bg-[#02386e] text-white rounded-full p-3 shadow-lg hover:bg-blue-800 transition-colors"
                aria-label="Scroll to top"
            >
                {/* Use a simple HTML/Unicode arrow or replace with an SVG icon */}
                <span className="text-xl font-bold">&uarr;</span> 
            </button>
        </div>
    );
};

export default ScrollArrow;