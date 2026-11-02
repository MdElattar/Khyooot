import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductItem from './ProductItem';

const RelatedProducts = ({ category, subCategory, currentProductId }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      // 1. استبعاد المنتج الحالي
      let productsCopy = products.filter((item) => item._id !== currentProductId);

      // 2. خلط عشوائي حقيقي لكل المنتجات المتاحة (Fisher-Yates Shuffle)
      for (let i = productsCopy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [productsCopy[i], productsCopy[j]] = [productsCopy[j], productsCopy[i]];
      }

      // 3. أخذ أول 5 منتجات بعد الخلط العشوائي لضمان التنوع التام
      setRelated(productsCopy.slice(0, 5));
    }
  }, [products, currentProductId]);

  return (
    <div className="my-24">
      <div className="text-center text-3xl py-2 font-serif uppercase tracking-wider mb-6">
        <p className="text-gray-900">You May Also Like</p>
        <span className="text-xs text-gray-400 font-sans tracking-widest uppercase block mt-1">
          Curated collection pieces for your style
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-8">
        {related.map((item, index) => (
          <ProductItem 
            key={index} 
            id={item._id} 
            name={item.name} 
            price={item.price} 
            image={item.image} 
            stock={item.stock}
            sizesStock={item.sizesStock}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;