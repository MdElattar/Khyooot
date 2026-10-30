import React from 'react';

const SplitFeature = ({ title, subtitle, imageUrl, linkUrl }) => {
    return (
        <section className="split-feature-section">
            <div className="split-feature-container">
                
                {/* 1. Left Column: Text and Button */}
                <div className="split-text-area">
                    <p className="split-subtitle">{subtitle}</p>
                    <h2 className="split-title">{title}</h2>
                    <a href={linkUrl} className="split-shop-now-button">
                        SHOP NOW
                    </a>
                </div>

                {/* 2. Right Column: Image */}
                <div className="split-image-area">
                    <img 
                        src={imageUrl} 
                        alt={title} 
                        className="feature-image"
                    />
                </div>
                
            </div>
        </section>
    );
};

export default SplitFeature;