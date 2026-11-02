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
        // تعيين أول مقاس متاح وكميته أكبر من صفر كافتراضي
        if (item.sizes && item.sizes.length > 0) {
          const firstAvailable = item.sizes.find(sz => (item.sizesStock?.[sz] ?? 1) > 0);
          setCurrentSize(firstAvailable || item.sizes[0]);
        }
        if (item.colors && item.colors.length > 0) setCurrentColor(item.colors[0]);
        return null;
      }
    });
  };

  const handleAddToCart = () => {
    const stockForSize = productData.sizesStock?.[currentSize] ?? productData.stock;
    if (stockForSize <= 0) {
      toast.error(`Selected size (${currentSize}) is out of stock`);
      return;
    }
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
          {/* Thumbnails - أفقي متناسق على الموبايل واللابتوب */}
          <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-y-scroll justify-start gap-3 lg:w-[20%] w-full scrollbar-none pb-2 lg:pb-0">
            {productData.image.map((item, index) => (
              <div 
                key={index} 
                onClick={() => setImage(item)}
                className={`cursor-pointer border transition-all duration-300 rounded-xl overflow-hidden flex-shrink-0 w-20 lg:w-full aspect-[3/4] ${image === item ? 'border-black ring-2 ring-black' : 'border-gray-200 opacity-60 hover:opacity-100'}`}
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

          {/* Price & Stock Status */}
          <div className="mt-6 flex items-center justify-between">
            <div className="text-2xl sm:text-3xl font-light text-gray-900 tracking-tight">
              {currency}{productData.price}
            </div>
            
            {/* عرض حالة المخزون الإجمالي بذكاء */}
            <div className="text-xs font-semibold tracking-wider uppercase">
              {productData.stock > 0 ? (
                <span className="text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                  In Stock ({productData.stock} total)
                </span>
              ) : (
                <span className="text-rose-600 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-200">
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-600 leading-relaxed font-light">
            {productData.description}
          </p>

          <div className="h-[1px] bg-gray-100 my-8" />

          {/* Size Selection with Stock Integration */}
          {productData?.sizes && productData.sizes.length > 0 && (
            <div className="flex flex-col gap-3 mb-6">
              <div className="flex justify-between items-center text-xs uppercase tracking-wider font-medium text-gray-700">
                <span>Select Size (Stock Status)</span>
                <span className="text-gray-400 underline cursor-pointer hover:text-black transition-colors">Size Guide</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {productData.sizes.map((item, index) => {
                  const sizeStockQty = productData.sizesStock?.[item] ?? 1;
                  const isSizeOut = sizeStockQty <= 0;

                  return (
                    <button
                      key={index}
                      onClick={() => {
                        if (isSizeOut) {
                          toast.error(`Size ${item} is out of stock`);
                          return;
                        }
                        setCurrentSize(item);
                      }}
                      disabled={isSizeOut}
                      className={`h-14 min-w-[72px] px-4 text-xs font-medium tracking-widest transition-all rounded-xl border flex flex-col items-center justify-center gap-1 ${
                        isSizeOut
                          ? "bg-gray-100 text-gray-400 border-gray-200 line-through cursor-not-allowed opacity-60"
                          : item === currentSize 
                            ? "border-black bg-black text-white shadow-md shadow-black/10 scale-105" 
                            : "border-gray-200 bg-white text-gray-800 hover:border-gray-400"
                      }`}
                      title={isSizeOut ? "Out of Stock" : `${sizeStockQty} available`}
                    >
                      <span className="font-bold">{item}</span>
                      <span className="text-[10px] opacity-75">
                        {isSizeOut ? "Sold" : `${sizeStockQty} left`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        {/* Color Selection - Wide & Bold */}
          {productData?.colors && productData.colors.length > 0 && (
            <div className="flex flex-col gap-3 mb-8">
              <span className="text-xs uppercase tracking-wider font-bold text-gray-800">
                Color: <span className="font-normal text-gray-500">{currentColor}</span>
              </span>
              <div className="flex gap-3 flex-wrap">
                {productData.colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentColor(color)}
                    className={`h-12 px-6 text-xs tracking-wider rounded-xl border transition-all font-bold ${
                      currentColor === color 
                        ? "border-black bg-black text-white shadow-md scale-105" 
                        : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons - Extra Large & Prominent */}
          <div className="flex flex-col gap-4 mt-4 w-full">
            <button
              onClick={handleAddToCart}
              disabled={productData.stock <= 0}
              className={`w-full h-16 px-8 text-sm font-bold tracking-widest uppercase rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 ${
                productData.stock > 0 
                  ? "bg-black text-white hover:bg-neutral-800 active:scale-[0.99] shadow-black/20 cursor-pointer" 
                  : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
              }`}
            >
              {productData.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </button>
            <button
              onClick={() => {
                const stockForSize = productData.sizesStock?.[currentSize] ?? productData.stock;
                if (stockForSize > 0) {
                  handleAddToCart();
                  navigate('/cart');
                } else {
                  toast.error(`Selected size (${currentSize}) is out of stock`);
                }
              }}
              disabled={productData.stock <= 0}
              className={`w-full h-16 px-8 text-sm font-bold tracking-widest uppercase rounded-2xl transition-all flex items-center justify-center gap-2 ${
                productData.stock > 0
                  ? "border-2 border-black text-black bg-white hover:bg-black hover:text-white cursor-pointer shadow-sm"
                  : "border border-gray-200 text-gray-300 cursor-not-allowed"
              }`}
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
            Description & Details
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
              <p className="text-base font-serif text-gray-900 italic">
                "Designed for those who appreciate uncompromising detail, the <span className="font-semibold">{productData.name}</span> redefines modern luxury streetwear through immaculate silhouette and weighted comfort."
              </p>
              <p>
                Part of our exclusive <span className="uppercase font-semibold tracking-wider">{productData.category}</span> lineup, this piece merges avant-garde tailoring with everyday wearability. Every thread is meticulously woven to provide breathable durability, ensuring it remains a cornerstone of your wardrobe season after season.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100 text-xs">
                <div>
                  <span className="font-bold uppercase text-black block mb-1">Fabric & Craft</span>
                  <span className="text-gray-500">100% Premium Heavyweight Cotton, pre-shrunk for an enduring fit.</span>
                </div>
                <div>
                  <span className="font-bold uppercase text-black block mb-1">Signature Fit</span>
                  <span className="text-gray-500">Oversized luxury drop-shoulder cut tailored for structured drape.</span>
                </div>
                <div>
                  <span className="font-bold uppercase text-black block mb-1">Care Protocol</span>
                  <span className="text-gray-500">Machine wash cold inside out; line dry recommended.</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
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
          currentProductId={productData._id}
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