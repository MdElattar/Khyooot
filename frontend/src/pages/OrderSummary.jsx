import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";

const FREE_DELIVERY_LIMIT = 2000;

const OrderSummary = ({ isFormValid, onSubmitHandler, paymentMethod, receiptImage }) => {
  const { cartItems, products, currency, delivery_fee } = useContext(ShopContext);

  const getProduct = (id) => products.find((p) => p._id === id);

  const subtotal = Object.keys(cartItems).reduce((acc, variantId) => {
    const item = cartItems[variantId];
    const product = getProduct(item.productId);
    if (!product) return acc;
    return acc + product.price * item.count;
  }, 0);

  const effectiveDeliveryFee =
    subtotal >= FREE_DELIVERY_LIMIT ? 0 : Number(delivery_fee);

  const total = subtotal + effectiveDeliveryFee;

  const progressPercentage = Math.min((subtotal / FREE_DELIVERY_LIMIT) * 100, 100);

  const isButtonDisabled =
    !isFormValid || (paymentMethod === "instapay" && !receiptImage);

  return (
    <div className="w-full bg-white border border-gray-100 shadow-xl shadow-black/[0.04] p-6 sm:p-8 rounded-3xl sticky top-28 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-gray-900 tracking-wide uppercase">
          Order Summary
        </h2>
        <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 rounded-full text-gray-600">
          {Object.keys(cartItems).length} Items
        </span>
      </div>

      {/* Free Delivery Mini Bar */}
      <div className="bg-sky-50/70 border border-sky-100 p-3.5 rounded-2xl">
        <div className="flex justify-between items-center text-xs font-semibold text-sky-900 mb-1.5">
          <span>
            {subtotal >= FREE_DELIVERY_LIMIT ? (
              "🎉 Free Delivery Unlocked!"
            ) : (
              <>Add <span className="text-sky-700 font-bold">{currency} {FREE_DELIVERY_LIMIT - subtotal}</span> for Free Delivery</>
            )}
          </span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-sky-200/50 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-[#003459] h-full transition-all duration-500 rounded-full" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* ITEMS LIST */}
      <div className="space-y-3.5 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
        {Object.keys(cartItems).map((variantId) => {
          const item = cartItems[variantId];
          const product = getProduct(item.productId);
          if (!product) return null;

          return (
            <div key={variantId} className="flex items-center gap-3.5 p-2.5 bg-gray-50/60 rounded-2xl border border-gray-100">
              <div className="w-12 h-14 bg-white rounded-xl overflow-hidden shrink-0 border border-gray-200/60 shadow-sm">
                <img
                  src={product.image[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-900 truncate">{product.name}</p>
                <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                  <span className="bg-white px-2 py-0.5 rounded-md border border-gray-200/50 font-medium">Qty: {item.count}</span>
                  <span className="font-medium text-gray-700">{item.size} • {item.color}</span>
                </div>
              </div>
              <p className="text-xs font-bold text-gray-900 shrink-0 pr-1">
                {currency} {product.price * item.count}
              </p>
            </div>
          );
        })}
      </div>

      {/* CALCULATIONS */}
      <div className="border-t border-gray-100 pt-4 space-y-3 text-sm">
        <div className="flex justify-between text-gray-600 font-medium">
          <span>Subtotal</span>
          <span className="text-gray-900 font-semibold">
            {currency} {subtotal}
          </span>
        </div>

        <div className="flex justify-between text-gray-600 font-medium items-center">
          <span>Shipping Fee</span>
          <span className={`font-semibold ${effectiveDeliveryFee === 0 ? "text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md" : "text-gray-900"}`}>
            {effectiveDeliveryFee === 0 ? "FREE" : `${currency} ${effectiveDeliveryFee}`}
          </span>
        </div>
      </div>

      {/* TOTAL */}
      <div className="border-t border-gray-100 pt-4 flex justify-between items-center text-lg font-bold text-gray-900">
        <span>Total Amount</span>
        <span className="text-2xl font-black text-[#003459]">
          {currency} {total}
        </span>
      </div>

      {/* SUBMIT BUTTON */}
      <button
        onClick={onSubmitHandler}
        disabled={isButtonDisabled}
        className={`w-full py-4 rounded-2xl font-bold uppercase tracking-wider text-xs transition-all duration-300 shadow-xl flex items-center justify-center gap-2 ${
          !isButtonDisabled
            ? "bg-[#003459] text-white hover:bg-black shadow-black/15 hover:scale-[1.01]"
            : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none border border-gray-200"
        }`}
      >
        <span>
          {paymentMethod === "instapay" && !receiptImage
            ? "Please Upload Receipt On Left"
            : isFormValid
            ? "Place Order & Pay Securely"
            : "Complete Shipping Info"}
        </span>
        {!isButtonDisabled && (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        )}
      </button>

      {/* Trust Badges */}
      <div className="pt-2 border-t border-gray-50 flex items-center justify-center gap-4 text-gray-400 text-xs font-medium">
        <span className="flex items-center gap-1">🔒 SSL Secure</span>
        <span>•</span>
        <span className="flex items-center gap-1">🛡️ Buyer Protection</span>
        <span>•</span>
        <span className="flex items-center gap-1">⚡ Fast Shipping</span>
      </div>
    </div>
  );
};

export default OrderSummary;