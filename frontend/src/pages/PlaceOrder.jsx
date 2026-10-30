import { useContext, useEffect, useState } from "react";
import Title from "../components/Title";
import OrderSummary from "./OrderSummary";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";

const PlaceOrder = () => {
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [receiptImage, setReceiptImage] = useState(null);

  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    delivery_fee,
    products,
    getCartAmount,
  } = useContext(ShopContext);

  const [step, setStep] = useState(
    () => Number(localStorage.getItem("checkoutStep")) || 1
  );

  const [hasInteracted, setHasInteracted] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    country: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = "Required";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goToStep = (targetStep) => {
    if (targetStep > step) {
      const isValid = validateForm();
      if (!isValid) return;
    }
    setStep(targetStep);
    localStorage.setItem("checkoutStep", targetStep);
  };

  const handleChange = (e) => {
    setHasInteracted(true);
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async () => {
    if (paymentMethod === "instapay" && !receiptImage) {
      toast.error("Please upload the payment transfer receipt");
      return;
    }

    try {
      let orderItems = [];

      for (const itemKey in cartItems) {
        const [productId, size, color] = itemKey.split("_");
        const quantity = cartItems[itemKey].count;

        if (quantity > 0) {
          const itemInfo = products.find((product) => product._id === productId);
          if (!itemInfo) continue;

          orderItems.push({
            productId: itemInfo._id,
            name: itemInfo.name,
            description: itemInfo.description,
            price: itemInfo.price,
            image: itemInfo.image,
            category: itemInfo.category,
            subCategory: itemInfo.subCategory,
            sizes: itemInfo.sizes,
            colors: itemInfo.colors,
            bestseller: itemInfo.bestseller,
            status: itemInfo.status,
            size: size,
            color: color,
            quantity: quantity,
            date: Date.now(),
          });
        }
      }

      if (orderItems.length === 0) {
        toast.error("Your cart is empty or products could not be found.");
        return;
      }

      const orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
        paymentMethod: paymentMethod === "instapay" ? "InstaPay" : "Cash on Delivery",
      };

      const response = await axios.post(
        backendUrl + "/api/order/place",
        orderData,
        { headers: { token } }
      );

      if (response.data.success) {
        setCartItems({});
        navigate("/orders");
        toast.success(
          paymentMethod === "instapay"
            ? "InstaPay order submitted successfully!"
            : "Order placed successfully!"
        );
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Order Submission Error:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    localStorage.setItem("checkoutStep", step);
    localStorage.setItem("checkoutData", JSON.stringify(formData));
  }, [step, formData]);

  useEffect(() => {
    const savedStep = localStorage.getItem("checkoutStep");
    const savedData = localStorage.getItem("checkoutData");

    if (savedStep) setStep(Number(savedStep));
    if (savedData) setFormData(JSON.parse(savedData));
  }, []);

  useEffect(() => {
    const valid = Object.values(formData).every((v) => v.trim());
    setIsFormValid(valid);
  }, [formData]);

  const inputStyle = (fieldName) => `
    w-full px-4 py-3.5 bg-gray-50 border rounded-2xl text-sm transition-all outline-none 
    ${
      errors[fieldName] && hasInteracted
        ? "border-red-400 bg-red-50/30 focus:border-red-500"
        : "border-gray-200 focus:border-gray-900 focus:bg-white shadow-sm"
    }
  `;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* LEFT SIDE – FORM & PAYMENT */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-black/[0.03] p-6 sm:p-10 space-y-8">
          
          {/* CONTACT SECTION */}
          <div>
            <div className="mb-4 text-xl font-bold tracking-wide text-gray-900">
              <Title text1="CONTACT INFORMATION" />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email address (e.g., name@example.com)"
              value={formData.email}
              onChange={handleChange}
              onClick={() => goToStep(1)}
              className={inputStyle("email")}
            />
          </div>

          {/* DELIVERY SECTION */}
          <div>
            <div className="mb-4 text-xl font-bold tracking-wide text-gray-900">
              <Title text1="SHIPPING ADDRESS" />
            </div>

            <div className="space-y-4">
              <input
                onClick={() => goToStep(2)}
                type="text"
                placeholder="Country"
                name="country"
                className={inputStyle("country")}
                value={formData.country}
                onChange={handleChange}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  onClick={() => goToStep(2)}
                  type="text"
                  placeholder="First name"
                  name="firstName"
                  className={inputStyle("firstName")}
                  value={formData.firstName}
                  onChange={handleChange}
                />
                <input
                  onClick={() => goToStep(2)}
                  type="text"
                  placeholder="Last name"
                  name="lastName"
                  className={inputStyle("lastName")}
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>

              <input
                onClick={() => goToStep(2)}
                type="text"
                placeholder="Street Address (e.g., Building, Street, Area)"
                name="address"
                className={inputStyle("address")}
                value={formData.address}
                onChange={handleChange}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input
                  onClick={() => goToStep(2)}
                  type="text"
                  placeholder="City"
                  name="city"
                  className={inputStyle("city")}
                  value={formData.city}
                  onChange={handleChange}
                />
                <input
                  onClick={() => goToStep(2)}
                  type="text"
                  placeholder="State / Governorate"
                  name="state"
                  className={inputStyle("state")}
                  value={formData.state}
                  onChange={handleChange}
                />
                <input
                  onClick={() => goToStep(2)}
                  type="text"
                  placeholder="ZIP Code"
                  name="zip"
                  className={inputStyle("zip")}
                  value={formData.zip}
                  onChange={handleChange}
                />
              </div>

              <input
                onClick={() => goToStep(2)}
                type="tel"
                placeholder="Phone Number"
                name="phone"
                className={inputStyle("phone")}
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* PAYMENT SECTION */}
          <div className="pt-4 border-t border-gray-100">
            <h2 className="text-xl font-bold tracking-wide text-gray-900 mb-1">
              PAYMENT METHOD
            </h2>
            <p className="text-xs text-gray-400 mb-6 font-medium">
              All transactions are secure, encrypted, and processed instantly.
            </p>

            <div className="space-y-4">
              
              {/* INSTAPAY DIRECT TRANSFER */}
              <div
                onClick={() => {
                  setPaymentMethod("instapay");
                  goToStep(3);
                }}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === "instapay"
                    ? "bg-purple-50/50 border-purple-600 shadow-sm ring-1 ring-purple-600/20"
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "instapay"}
                      onChange={() => setPaymentMethod("instapay")}
                      className="w-4 h-4 text-purple-600 accent-purple-600 cursor-pointer"
                    />
                    <div>
                      <p className="font-bold text-sm text-gray-900 tracking-wide">
                        INSTAPAY DIRECT TRANSFER
                      </p>
                      <p className="text-[11px] text-purple-700 font-medium mt-0.5">
                        Instant mobile bank transfer in Egypt
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold px-3 py-1 bg-purple-100 text-purple-800 rounded-full tracking-wider uppercase">
                    Instant
                  </span>
                </div>

                {/* Sub-details when selected (Number + Receipt Upload) */}
                {paymentMethod === "instapay" && (
                  <div className="mt-4 pt-4 border-t border-purple-100 space-y-4 text-xs text-gray-600">
                    <p className="leading-relaxed">
                      Please transfer the total amount via InstaPay app to the official account number below:
                    </p>
                    
                    {/* Number Box */}
                    <div className="bg-white p-3 rounded-xl border border-purple-200 flex items-center justify-between shadow-xs">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 uppercase font-semibold">InstaPay Number</span>
                        <span className="font-mono text-sm font-bold text-gray-900">01099622861</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText("01099622861");
                          toast.success("InstaPay number copied!");
                        }}
                        className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[11px] font-semibold transition-colors"
                      >
                        Copy Number
                      </button>
                    </div>

                    {/* Receipt File Input */}
                    <div className="pt-2">
                      <label className="block text-[11px] font-bold text-purple-900 uppercase tracking-wider mb-2">
                        Upload Payment Receipt Screenshot:
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => setReceiptImage(e.target.files[0])}
                        className="w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer bg-white p-2 rounded-xl border border-purple-200"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* CASH ON DELIVERY */}
              <div
                onClick={() => {
                  setPaymentMethod("cod");
                  goToStep(3);
                }}
                className={`flex items-center justify-between p-5 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === "cod"
                    ? "bg-[#003459]/5 border-[#003459] shadow-sm ring-1 ring-[#003459]/20"
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="w-4 h-4 text-[#003459] accent-[#003459] cursor-pointer"
                  />
                  <div>
                    <p className="font-bold text-sm text-gray-900 tracking-wide">
                      CASH ON DELIVERY (COD)
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Pay upon receiving your package at your doorstep
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full tracking-wider uppercase">
                  Available
                </span>
              </div>

              {/* CREDIT CARDS / WALLETS (COMING SOON) */}
              <div className="flex items-center justify-between p-5 rounded-2xl border border-gray-200 bg-gray-50/50 opacity-60 cursor-not-allowed">
                <div className="flex items-center gap-3.5">
                  <input type="radio" disabled className="w-4 h-4 cursor-not-allowed" />
                  <div>
                    <p className="font-semibold text-sm text-gray-600">
                      CREDIT CARD / ONLINE WALLETS
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Visa, MasterCard & E-Wallets
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-md uppercase tracking-wider">
                  Coming Soon
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT SIDE – ORDER SUMMARY */}
        <div className="lg:sticky lg:top-28">
          <OrderSummary
            isFormValid={isFormValid}
            hasInteracted={hasInteracted}
            onSubmitHandler={onSubmitHandler}
            paymentMethod={paymentMethod}
            receiptImage={receiptImage}
          />
        </div>

      </div>
    </div>
  );
};

export default PlaceOrder;