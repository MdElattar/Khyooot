import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductItem from './ProductItem';

const BestSeller = () => {
    // 1. Get products from global context
    const { products } = useContext(ShopContext);

    // 2. State to hold the filtered best seller products
    const [bestSeller, setBestSeller] = useState([]);

    // 3. Effect to filter products when the component mounts or 'products' changes
    useEffect(() => {
        // Filter products where the 'bestseller' property is true
        const bestProduct = products.filter((item) => item.bestseller);

        // Slice the array to show only the first 5 best sellers
        setBestSeller(bestProduct.slice(0, 5));
    }, [products]); // Dependency array ensures this runs when products are loaded

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16'>
            {/* Section Header */}
            <div className='text-center py-8'>
                <span className='text-gray-400 text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase mb-2 block'>
                    Handpicked Favorites
                </span>
                <h2 className="text-3xl sm:text-4xl font-black tracking-wider text-gray-900 uppercase">
                    Winter Collection
                </h2>
                <div className="w-16 h-[2px] bg-gray-900 mx-auto mt-3" />
            </div>

            {/* 4. Conditional Rendering: Products or Typewriter Animation Message */}
            {bestSeller.length > 0 ? (
                // تم تعديل الـ Grid هنا ليكون متجاوباً ومناسباً للحجم (2 على الموبايل، 3 للإي باد، 4-5 للابتوب)
                <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 mt-6'>
                    {
                        bestSeller.map((item, index) => (
                            <ProductItem
                                key={index}
                                id={item._id}
                                name={item.name}
                                image={item.image}
                                price={item.price}
                            />
                        ))
                    }
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <p className="text-lg sm:text-xl font-medium text-gray-600 tracking-wider overflow-hidden whitespace-nowrap border-r-2 border-gray-800 animate-typing">
                        Sorry, our luxury pieces in this category are currently sold out and being crafted anew...
                    </p>
                </div>
            )}
        </div>
    );
};

export default BestSeller;