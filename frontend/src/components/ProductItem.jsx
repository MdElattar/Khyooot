import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { NavLink } from 'react-router-dom';

const ProductItem = ({ id, image, name, price, lastPrice, stock }) => {
  
  const { currency } = useContext(ShopContext);
  const isSoldOut = stock !== undefined && stock <= 0;

  return (
    <NavLink className={`text-gray-700 cursor-pointer group block ${isSoldOut ? 'opacity-75' : ''}`} to={`/product/${id}`}>
      
      {/* Image container with fixed aspect ratio and rounded corners */}
      <div className='overflow-hidden rounded-lg bg-gray-100 aspect-[3/4] relative'>
        <img 
          className={`w-full h-full object-cover object-center group-hover:scale-105 transition duration-300 ease-in-out ${isSoldOut ? 'grayscale filter' : ''}`} 
          src={image[0]} 
          alt={name} 
        />
        
        {/* Sold Out Badge */}
        {isSoldOut && (
          <div className='absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center'>
            <span className='bg-gray-800/90 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-lg shadow-lg'>
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className='pt-3 pb-1'>
        <p className='text-sm sm:text-base font-medium text-gray-800 truncate'>{name}</p>
        <div className='flex items-center justify-between mt-1'>
          <p className='text-sm font-semibold text-gray-900'>
            {currency}{price} {lastPrice && <span className='line-through text-gray-400 ml-2 text-xs'>{lastPrice}</span>}
          </p>
          {isSoldOut && (
            <span className='text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-0.5 rounded'>
              Sold Out
            </span>
          )}
        </div>
      </div>

    </NavLink>
  );
};

export default ProductItem;