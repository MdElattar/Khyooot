import React from 'react';

// Data structure for the collection categories
const collectionsData = [
    { name: "Hoodies", image: "src/assets/frontend_assets/hoddies.jpeg", link: "/hoodies" },
    { name: "T-shirts", image: "/path/to/tshirts.jpg", link: "/collection" },
    { name: "BabyTees", image: "/path/to/cargos.jpg", link: "/collection/" },
    { name: "Pants", image: "/path/to/knithoodies.jpg", link: "/collection/" },
    { name: "caps", image: "/path/to/denim.jpg", link: "/collection/" },
];

const NewCollection = () => {
    return (
        <section className="new-collection-section">
            <h2 className="section-title">
                New Collection
                <div className="title-underline"></div>
            </h2>

            <div className="collection-grid">
                {collectionsData.map((item, index) => (
                    // Use an <a> tag for navigation, or Link component if using React Router
                    <a 
                        key={item.name} 
                        href={item.link} 
                        className={`collection-item item-${index + 1}`}
                        style={{ backgroundImage: `url(${item.image})` }}
                    >
                        {/* Overlay element for text visibility and hover effect */}
                        <div className="item-overlay">
                            <span className="item-name">{item.name}</span>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
};

export default NewCollection;