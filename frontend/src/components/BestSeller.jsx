import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductItem from './ProductItem';
import { useNavigate } from 'react-router-dom';

// استيراد الصور الخاصة بكل فئة من مجلد الموارد لديك
import hoodiesImg from '../assets/frontend_assets/ArabianBurghandy.jpeg'; 
import crownecksImg from '../assets/frontend_assets/CAVARLY5.jpg'; 
import jacketsImg from '../assets/frontend_assets/jackets.jpeg';
import tshirtsImg from '../assets/frontend_assets/tshirt3.jpeg';
import babeteesImg from '../assets/frontend_assets/BabeTee.jpeg';

const BestSeller = () => {
    const { products } = useContext(ShopContext);
    const navigate = useNavigate();

    // الـ 5 فئات المفصلة بتوزيع Bento Grid متناسق (3 أعمدة في كل صف)
    const categories = [
        { name: 'Hoodies', image: hoodiesImg, desc: 'Cozy luxury for winter', span: 'md:col-span-2' },
        { name: 'TShirts', image: tshirtsImg, desc: 'Everyday refined cotton', span: 'md:col-span-1' },
        { name: 'Crownecks', image: crownecksImg, desc: 'Classic tailored essentials', span: 'md:col-span-1' },
        { name: 'Jackets', image: jacketsImg, desc: 'Statement outer layers', span: 'md:col-span-2' },
        { name: 'Babetees', image: babeteesImg, desc: 'Modern cropped fits', span: 'md:col-span-3' }, // تم تكبيرها لتشمل الصف بالكامل وبشكل متناسق مع الشبكة
    ];

    const [winterProducts, setWinterProducts] = useState([]);

    // جلب منتجات الـ Winter Collection المميزة (bestseller)
    useEffect(() => {
        const filtered = products.filter((item) => item.bestseller);
        setWinterProducts(filtered);
    }, [products]);

    // التوجيه لصفحة الـ Collection وتصفية الفئة المحددة
    const handleCategoryClick = (categoryName) => {
        navigate(`/collection`, { state: { selectedCategory: categoryName } });
    };

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-20'>
            
            {/* =========================================================
                العنوان الرئيسي بتصميم أزرق فاخر 
               ========================================================= */}
            <div className='text-center py-6 mb-10'>
                <span className='text-[#003459] text-xs sm:text-sm font-bold tracking-[0.3em] uppercase mb-2 block'>
                    Exclusive Categories
                </span>
                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-wider text-gray-900 uppercase">
                    KHYOOT Collections
                </h2>
                <div className="w-20 h-[3px] bg-[#003459] mx-auto mt-4 rounded-full shadow-sm" />
            </div>

            {/* =========================================================
                الكروت بتوزيع Bento-Grid متناسق و3D Animations
               ========================================================= */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-24'>
                {categories.map((cat, index) => (
                    <div
                        key={index}
                        onClick={() => handleCategoryClick(cat.name)}
                        className={`cursor-pointer group relative rounded-2xl overflow-hidden shadow-lg h-72 sm:h-80 flex flex-col justify-end p-6 sm:p-8 transition-all duration-500 transform hover:-translate-y-3 hover:rotate-1 hover:shadow-2xl hover:shadow-[#003459]/20 border border-gray-100 ${cat.span}`}
                    >
                        {/* صورة الخلفية مع تأثير التكبير الثلاثي الأبعاد */}
                        <div 
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110" 
                            style={{ backgroundImage: `url(${cat.image})` }}
                        />
                        
                        {/* طبقة تدرج زرقاء/سوداء متناسقة مع هوية البراند */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#003459]/90 via-black/40 to-transparent transition-all duration-500 group-hover:from-[#00223e]/95" />

                        {/* إطار مضيء بلون أزرق فخم يظهر عند التمرير */}
                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#003459]/50 rounded-2xl transition-all duration-500 pointer-events-none" />
                        
                        {/* نصوص وتفاصيل الفئة */}
                        <div className="relative z-10 flex flex-col items-start">
                            <span className="text-sky-300 text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase mb-1 drop-shadow">
                                Khyoot Tailored
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-wider uppercase mb-2 group-hover:text-sky-100 transition-colors">
                                {cat.name}
                            </h3>
                            <p className="text-gray-300 text-xs sm:text-sm font-light tracking-wide opacity-80 mb-4 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                {cat.desc}
                            </p>
                            
                            {/* زر التوجيه العصري */}
                            <div className="flex items-center gap-2 text-white text-xs font-bold tracking-widest uppercase border-b-2 border-sky-400 pb-1 group-hover:text-sky-300 transition-colors">
                                <span>Explore Collection</span>
                                <span className="transform group-hover:translate-x-2 transition-transform duration-300">&#8594;</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* =========================================================================
                الجزء الثاني: سكشن الـ Winter Collection (يظهر فقط عند وجود منتجات)
               ========================================================================= */}
            {winterProducts.length > 0 && (
                <div className="mt-16 pt-16 border-t border-gray-100">
                    <div className='text-center py-6'>
                        <span className='text-[#003459] text-xs sm:text-sm font-bold tracking-[0.3em] uppercase mb-2 block'>
                            Handpicked Season
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-wider text-gray-900 uppercase">
                            Winter Collection
                        </h2>
                        <div className="w-16 h-[3px] bg-[#003459] mx-auto mt-4 rounded-full" />
                    </div>

                    {/* شبكة المنتجات */}
                    <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 mt-10'>
                        {
                            winterProducts.slice(0, 8).map((item, index) => (
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
                </div>
            )}

        </div>
    );
};

export default BestSeller;