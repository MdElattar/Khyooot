import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Collection = () => {
    const { products } = useContext(ShopContext);
    const [showFilter, setShowFilter] = useState(false);
    const [filterProducts, setFilterProducts] = useState([]);
    const [category, setCategory] = useState([]);
    const [subCategory, setSubCategory] = useState([]);
    const [sortType, setSortType] = useState('revalent');

    const toggleCategory = (e) => {
      if (category.includes(e.target.value)) {
        setCategory(prev => prev.filter(item => item !== e.target.value));
      } else {
        setCategory(prev => [...prev, e.target.value]);
      }
    };
    
    const toggleSubCategory = (e) => {
      if (subCategory.includes(e.target.value)) {
        setSubCategory(prev => prev.filter(item => item !== e.target.value));
      } else {
        setSubCategory(prev => [...prev, e.target.value]);
      }
    };

    const applyFilter = () => {
      let productsCopy = products.slice();

      if (category.length > 0) {
        productsCopy = productsCopy.filter(item => category.includes(item.category));
      }
      if (subCategory.length > 0) {
        productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory));
      }

      // ترتيب المنتجات بحيث الأحدث (الجديد) يظهر في الأعلى أولاً
      productsCopy.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

      setFilterProducts(productsCopy);
    };

    const sortProduct = () => {
      let fpCopy = filterProducts.slice();

      switch (sortType) {
        case 'low-high':
          setFilterProducts(fpCopy.sort((a, b) => (a.price - b.price)));
          break;
        case 'high-low':
          setFilterProducts(fpCopy.sort((a, b) => (b.price - a.price)));
          break;
        default:
          applyFilter();
          break;
      }
    };
    
    useEffect(() => {
      sortProduct();
    }, [sortType]);
    
    useEffect(() => {
      applyFilter();
    }, [category, subCategory, products]);

    return (
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 mt-24'>
        <div className='flex flex-col sm:flex-row gap-8 sm:gap-10'>
          
          {/* LEFT SIDE: Filter Options / Sidebar */}
          <div className='w-full sm:w-64 shrink-0 space-y-6'>
            
            {/* Filter Toggle Header for Mobile */}
            <div 
              onClick={() => setShowFilter(!showFilter)}
              className='flex items-center justify-between sm:justify-start gap-3 cursor-pointer bg-gray-50 sm:bg-transparent p-4 sm:p-0 rounded-2xl border sm:border-0 border-gray-200'
            >
              <span className='font-bold text-base sm:text-lg tracking-wider text-gray-900'>
                FILTERS
              </span>
              <img 
                className={`w-4 h-4 transition-transform duration-300 sm:hidden ${showFilter ? 'rotate-90' : ''}`} 
                src="src/assets/frontend_assets/dropdown_icon.png" 
                alt="Toggle" 
              />
            </div>

            {/* Filter Containers Wrapper (Toggles on mobile) */}
            <div className={`space-y-6 ${showFilter ? 'block' : 'hidden sm:block'}`}>
              
              {/* Category Filter */}
              <div className='bg-white border border-gray-100 shadow-sm p-6 rounded-3xl'>
                <p className='text-xs font-extrabold uppercase tracking-widest text-gray-900 mb-4 pb-2 border-b border-gray-100'>
                  Categories
                </p>
                <div className='flex flex-col gap-3 text-sm font-medium text-gray-600'>
                  {['Men', 'Women', 'Unisex'].map((cat, idx) => (
                    <label key={idx} className='flex items-center gap-3 cursor-pointer hover:text-gray-900 transition-colors'>
                      <input 
                        className='w-4 h-4 rounded border-gray-300 text-[#003459] focus:ring-[#003459]' 
                        value={cat} 
                        type="checkbox" 
                        onChange={toggleCategory} 
                      /> 
                      {cat}
                    </label>
                  ))}
                </div>
              </div>

              {/* Type / SubCategory Filter */}
              <div className='bg-white border border-gray-100 shadow-sm p-6 rounded-3xl'>
                <p className='text-xs font-extrabold uppercase tracking-widest text-gray-900 mb-4 pb-2 border-b border-gray-100'>
                  Types
                </p>
                <div className='flex flex-col gap-3 text-sm font-medium text-gray-600'>
                  {['Hoodies', 'Crownecks', 'Jackets', 'TShirts', 'Babetees', 'Pants'].map((type, idx) => (
                    <label key={idx} className='flex items-center gap-3 cursor-pointer hover:text-gray-900 transition-colors'>
                      <input 
                        className='w-4 h-4 rounded border-gray-300 text-[#003459] focus:ring-[#003459]' 
                        value={type} 
                        type="checkbox" 
                        onChange={toggleSubCategory} 
                      /> 
                      {type}
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT SIDE: Products Grid Area */}
          <div className='flex-1'>
            
            {/* Header & Sorting Bar */}
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-gray-50/50 p-4 sm:p-6 rounded-3xl border border-gray-100'>
              <div>
                <h1 className='text-2xl sm:text-3xl font-black tracking-wider text-gray-900 uppercase'>
                  All Collections
                </h1>
                <p className='text-xs text-gray-400 font-medium mt-1'>
                  Showing {filterProducts.length} luxury pieces
                </p>
              </div>

              {/* Product Sort Dropdown */}
              <select 
                onChange={(e) => setSortType(e.target.value)} 
                className='bg-white border border-gray-200 text-xs sm:text-sm font-medium px-4 py-3 rounded-2xl outline-none focus:border-gray-900 shadow-sm cursor-pointer'
              >
                <option value="revalent">Sort by: Relevant</option>
                <option value="low-high">Sort by: Low to High</option>
                <option value="high-low">Sort by: High to Low</option>
              </select>
            </div>

            {/* Map Products or Empty State */}
            {filterProducts.length === 0 ? (
              <div className='text-center py-24 bg-gray-50/50 rounded-3xl border border-gray-100'>
                <p className='text-xl font-bold text-gray-800 mb-2'>No products found</p>
                <p className='text-xs text-gray-400'>Try clearing your filters to see more items.</p>
              </div>
            ) : (
              <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6'>
                {filterProducts.map((item, index) => (
                  <ProductItem 
                    key={index} 
                    id={item._id} 
                    name={item.name} 
                    price={item.price} 
                    image={item.image} 
                    stock={item.stock} 
                  />
                ))}
              </div>
            )}

          </div>

        </div>
      </div>
    );
};

export default Collection;