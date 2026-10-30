import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";

const Cart = () => {
  const {
    cartItems,
    products,
    currency,
    delivery_fee,
    updateCart,
    navigate,
  } = useContext(ShopContext);

  const FREE_DELIVERY_LIMIT = 2000;

  // Get product details by ID
  const getProduct = (id) => products.find((p) => p._id === id);

  // Check if cart is empty
  const isCartEmpty = !cartItems || Object.keys(cartItems).length === 0;

  // Calculate subtotal
  const subtotal = isCartEmpty ? 0 : Object.keys(cartItems).reduce((acc, variantId) => {
    const item = cartItems[variantId];
    const product = getProduct(item.productId);
    if (!product) return acc;
    return acc + product.price * item.count;
  }, 0);

  // Calculate delivery fee
  const effectiveDeliveryFee =
    isCartEmpty || subtotal >= FREE_DELIVERY_LIMIT ? 0 : Number(delivery_fee);

  // Final total
  const total = subtotal + effectiveDeliveryFee;

  // Progress towards free delivery (0 to 100%)
  const progressPercentage = Math.min((subtotal / FREE_DELIVERY_LIMIT) * 100, 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
      
      {/* Page Header */}
      <div className="text-center mb-10">
        <span className="text-gray-400 text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase mb-2 block">
          Shopping Bag
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-wider text-gray-900 uppercase">
          Your Cart
        </h1>
        <div className="w-16 h-[2px] bg-gray-900 mx-auto mt-3" />
      </div>

      {isCartEmpty ? (
        /* Empty Cart State */
        <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 rounded-3xl border border-gray-100 p-8">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-3xl mb-4">
            🛒
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Your cart is currently empty</h3>
          <p className="text-gray-500 text-sm max-w-sm mb-6">
            Explore our winter collection and add your favorite luxury pieces to your cart.
          </p>
          <button
            onClick={() => navigate("/collection")}
            className="bg-[#003459] hover:bg-black text-white px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-md"
          >
            Explore Collection
          </button>
        </div>
      ) : (
        /* Cart Content Grid */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          
          {/* Left Side: Cart Items List (Takes 2 columns) */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Free Delivery Progress Banner */}
            <div className="bg-sky-50 border border-sky-100 p-4 rounded-2xl mb-6">
              <div className="flex justify-between items-center text-xs sm:text-sm font-medium text-sky-900 mb-2">
                <span>
                  {subtotal >= FREE_DELIVERY_LIMIT ? (
                    "🎉 You've unlocked FREE Delivery!"
                  ) : (
                    <>Add <span className="font-bold">{currency} {FREE_DELIVERY_LIMIT - subtotal}</span> more for <span className="font-bold underline">FREE Delivery</span></>
                  )}
                </span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-sky-200/60 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-[#003459] h-full transition-all duration-500 rounded-full" 
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Items Loop */}
            {Object.keys(cartItems).map((variantId) => {
              const item = cartItems[variantId];
              const product = getProduct(item.productId);
              if (!product) return null;

              return (
                <div 
                  key={variantId} 
                  className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
                >
                  {/* Product Image & Info */}
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-24 h-28 sm:w-28 sm:h-32 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                      <img 
                        src={product.image[0]} 
                        alt={product.name} 
                        className="w-full h-full object-cover object-center" 
                      />
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <h3 className="font-bold text-gray-900 text-base sm:text-lg line-clamp-1">{product.name}</h3>
                      <p className="font-semibold text-gray-900 text-sm">
                        {currency} {product.price}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 font-medium pt-1">
                        <span className="bg-gray-100 px-2.5 py-1 rounded-md">Size: <strong className="text-gray-800">{item.size}</strong></span>
                        <span className="bg-gray-100 px-2.5 py-1 rounded-md">Color: <strong className="text-gray-800">{item.color}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100 gap-3">
                    
                    {/* Qty Box */}
                    <div className="flex items-center border border-gray-200 rounded-full bg-gray-50 p-1">
                      <button
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-white rounded-full transition-all text-sm font-bold shadow-sm"
                        onClick={() => updateCart(variantId, "decrease")}
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-gray-900">{item.count}</span>
                      <button
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-white rounded-full transition-all text-sm font-bold shadow-sm"
                        onClick={() => updateCart(variantId, "increase")}
                      >
                        +
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors flex items-center gap-1 mt-1"
                      onClick={() => updateCart(variantId, "remove")}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      Remove
                    </button>

                  </div>
                </div>
              );
            })}

          </div>

          {/* Right Side: Order Summary (Sticky Sidebar) */}
          <div className="lg:col-span-1 bg-white border border-gray-100 shadow-xl shadow-black/[0.03] p-6 sm:p-8 rounded-3xl sticky top-28 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-4">
              Order Summary
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Subtotal</span>
                <span className="text-gray-900 font-semibold">{currency} {subtotal}</span>
              </div>

              <div className="flex justify-between text-gray-600 font-medium items-center">
                <span>Delivery Fee</span>
                <span className={`font-semibold ${effectiveDeliveryFee === 0 ? "text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md" : "text-gray-900"}`}>
                  {effectiveDeliveryFee === 0 ? "FREE" : `${currency} ${effectiveDeliveryFee}`}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 flex justify-between items-center text-lg font-bold text-gray-900">
              <span>Total</span>
              <span className="text-xl text-[#003459]">{currency} {total}</span>
            </div>

            <button
              className="w-full bg-[#003459] hover:bg-black disabled:bg-gray-300 text-white py-4 rounded-full font-semibold uppercase tracking-wider text-xs transition-all duration-300 shadow-lg hover:shadow-xl"
              disabled={isCartEmpty}
              onClick={() => navigate("/place-order")}
            >
              Proceed to Checkout
            </button>
            
            <div className="text-center pt-2">
              <p className="text-xs text-gray-400">🔒 Secure checkout powered by KHYOOT</p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Cart;