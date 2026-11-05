import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { NavLink } from 'react-router-dom';

const ProductItem = ({ id, image, name, price, lastPrice, stock }) => {
  
  const { currency } = useContext(ShopContext);
  const isSoldOut = stock !== undefined && stock <= 0;

  return (
    <NavLink className="text-gray-700 cursor-pointer group block" to={`/product/${id}`}>
      
      {/* Image container with fixed aspect ratio and rounded corners (بدون أي Blur أو Overlay) */}
      <div className='overflow-hidden rounded-lg bg-gray-100 aspect-[3/4] relative'>
        <img 
          className='w-full h-full object-cover object-center group-hover:scale-105 transition duration-300 ease-in-out' 
          src={image[0]} 
          alt={name} 
        />
      </div>

      {/* Product Details */}
      <div className='pt-3 pb-1'>
        <p className='text-sm sm:text-base font-medium text-gray-800 truncate'>{name}</p>
        <div className='flex items-center justify-between mt-1'>
          <p className='text-sm font-semibold text-gray-900'>
            {currency}{price} {lastPrice && <span className='line-through text-gray-400 ml-2 text-xs'>{lastPrice}</span>}
          </p>

          {/* عرض Out of Stock بجانب السعر من تحت فقط عند نفاد المخزون */}
          {isSoldOut && (
            <span className='text-[10px] font-bold uppercase tracking-wider text-red-500 bg-red-50 px-2 py-0.5 rounded border border-red-100'>
              Out of stock
            </span>
          )}
        </div>
      </div>

    </NavLink>
  );
};

export default ProductItem;