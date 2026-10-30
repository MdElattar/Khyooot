import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/frontend_assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import { toast } from "react-toastify";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, token, navigate } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  
  const [currentSize, setCurrentSize] = useState("");
  const [currentColor, setCurrentColor] = useState("");
  const [activeTab, setActiveTab] = useState("description"); // للتبديل بين الوصف والتقييمات

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.image[0]);
        // تعيين قيم افتراضية أولية لو متاحة
        if (item.sizes && item.sizes.length > 0) setCurrentSize(item.sizes[0]);
        if (item.colors && item.colors.length > 0) setCurrentColor(item.colors[0]);
        return null;
      }
    });
  };

  const handleAddToCart = () => {
    if (!currentSize && productData?.sizes?.length > 0) {
      toast.error("Please select a size");
      return;
    }
    addToCart(productId, currentSize, currentColor);
    if (!token) {
      toast.error("Please Login First");
      navigate('/login');
    } else {
      toast.success("Added to your luxury cart");
    }
  };

  useEffect(() => {
    fetchProductData();
    window.scrollTo(0, 0);
  }, [productId, products]);

  return productData ? (
    <div className="px-4 mt-24 sm:px-[6vw] md:px-[8vw] lg:px-[10vw] pt-12 transition-opacity ease-in duration-500 opacity-100 bg-white">
      
      {/* Breadcrumb Navigation Minimalist */}
      <div className="text-xs text-gray-400 mb-8 tracking-wider uppercase flex items-center gap-2">
        <span>Home</span> / <span>Collection</span> / <span className="text-black font-medium">{productData.name}</span>
      </div>

      {/* Main Product Section */}
      <div className="flex gap-12 lg:gap-16 flex-col lg:flex-row">
        
        {/* Product Images (Gallery) */}
        <div className="flex-1 flex flex-col-reverse lg:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex lg:flex-col overflow-x-auto lg:overflow-y-scroll justify-between lg:justify-start gap-3 lg:w-[20%] w-full scrollbar-none">
            {productData.image.map((item, index) => (
              <div 
                key={index} 
                onClick={() => setImage(item)}
                className={`cursor-pointer border transition-all duration-300 rounded-lg overflow-hidden flex-shrink-0 w-[22%] lg:w-full aspect-[3/4] ${image === item ? 'border-black ring-1 ring-black' : 'border-gray-200 opacity-70 hover:opacity-100'}`}
              >
                <img src={item} className="w-full h-full object-cover" alt="" />
              </div>
            ))}
          </div>
          
          {/* Main Display Image */}
          <div className="w-full lg:w-[80%] aspect-[3/4] bg-gray-50 rounded-2xl overflow-hidden shadow-sm relative group">
            <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={image} alt={productData.name} />
            <span className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-white text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-medium">
              New Season
            </span>
          </div>
        </div>

        {/* Product Info & Actions */}
        <div className="flex-1 flex flex-col justify-start">
          
          <span className="text-xs tracking-widest text-gray-400 uppercase font-semibold mb-2">
            {productData.category || "Khyoot Exclusive"}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-gray-900 tracking-tight font-normal">
            {productData.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <img key={i} src={assets.star_icon} alt="star" className="w-3.5 h-3.5" />
              ))}
            </div>
            <p className="text-xs text-gray-500 tracking-wide font-medium">(122 Reviews)</p>
          </div>

          {/* Price */}
          <div className="mt-6 text-2xl sm:text-3xl font-light text-gray-900 tracking-tight">
            {currency}{productData.price}
          </div>

          <p className="mt-4 text-sm text-gray-600 leading-relaxed font-light">
            {productData.description}
          </p>

          <div className="h-[1px] bg-gray-100 my-8" />

          {/* Size Selection */}
          {productData?.sizes && productData.sizes.length > 0 && (
            <div className="flex flex-col gap-3 mb-6">
              <div className="flex justify-between items-center text-xs uppercase tracking-wider font-medium text-gray-700">
                <span>Select Size</span>
                <span className="text-gray-400 underline cursor-pointer hover:text-black transition-colors">Size Guide</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {productData.sizes.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSize(item)}
                    className={`h-11 min-w-[48px] px-4 text-xs font-medium tracking-widest transition-all rounded-lg border ${
                      item === currentSize 
                        ? "border-black bg-black text-white shadow-md shadow-black/10" 
                        : "border-gray-200 bg-white text-gray-800 hover:border-gray-400"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {productData?.colors && productData.colors.length > 0 && (
            <div className="flex flex-col gap-3 mb-8">
              <span className="text-xs uppercase tracking-wider font-medium text-gray-700">
                Color: <span className="font-normal text-gray-500">{currentColor}</span>
              </span>
              <div className="flex gap-3">
                {productData.colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentColor(color)}
                    className={`h-9 px-5 text-xs tracking-wider rounded-lg border transition-all ${
                      currentColor === color 
                        ? "border-black font-semibold bg-gray-50 ring-1 ring-black" 
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-black text-white h-14 px-8 text-xs font-semibold tracking-widest uppercase rounded-xl hover:bg-neutral-800 active:scale-[0.99] transition-all shadow-lg shadow-black/10 flex items-center justify-center gap-2"
            >
              Add to Cart
            </button>
            <button
              onClick={() => {
                handleAddToCart();
                navigate('/cart');
              }}
              className="flex-1 border border-black text-black h-14 px-8 text-xs font-semibold tracking-widest uppercase rounded-xl hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2"
            >
              Buy It Now
            </button>
          </div>

          {/* Perks & Trust Badges */}
          <div className="grid grid-cols-2 gap-4 mt-10 pt-8 border-t border-gray-100 text-xs text-gray-500">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
              <span>Complimentary Express Shipping</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
              <span>Easy 14-Day Returns & Exchanges</span>
            </div>
          </div>

        </div>
      </div>

      {/* ---------- Description & Review Interactive Tabs ---------- */}
      <div className="mt-28">
        <div className="flex border-b border-gray-200 gap-10">
          <button 
            onClick={() => setActiveTab("description")}
            className={`pb-4 text-sm tracking-wider uppercase transition-all relative ${activeTab === 'description' ? 'font-semibold text-black after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-black' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Description
          </button>
          <button 
            onClick={() => setActiveTab("reviews")}
            className={`pb-4 text-sm tracking-wider uppercase transition-all relative ${activeTab === 'reviews' ? 'font-semibold text-black after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-black' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Reviews (122)
          </button>
        </div>

        <div className="py-8 text-sm text-gray-600 leading-relaxed font-light">
          {activeTab === 'description' ? (
            <div className="flex flex-col gap-6 max-w-4xl">
              <p>
                Crafted with precision from premium weighted fabrics, this piece from KHYOOT embodies modern sophistication and effortless luxury. Designed with a tailored silhouette that offers both structure and fluid movement, it transitions seamlessly from daytime refinement to evening elegance.
              </p>
              <p>
                Every detail, from the reinforced stitching to the custom hardware elements, undergoes rigorous quality checks to ensure longevity and absolute comfort against the skin. Elevate your everyday wardrobe with investment pieces built on uncompromising standards.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="p-6 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-black">Sarah M.</span>
                  <span className="text-xs text-gray-400">October 24, 2026</span>
                </div>
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <img key={i} src={assets.star_icon} alt="star" className="w-3 h-3" />
                  ))}
                </div>
                <p className="text-gray-600">Absolute perfection. The fabric quality feels high-end and the fit is tailored precisely as expected.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-20 pt-10 border-t border-gray-100">
        <RelatedProducts
          category={productData.category}
          subCategory={productData.subCategory}
        />
      </div>

    </div>
  ) : (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Product;