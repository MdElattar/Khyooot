import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import { toast } from "react-toastify";

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrderData = async () => {
    try {
      if (!token) return;

      const response = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        let allOrdersItem = [];
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            item["status"] = order.status;
            item["payment"] = order.payment;
            item["paymentMethod"] = order.paymentMethod;
            item["date"] = order.date;
            allOrdersItem.push(item);
          });
        });
        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Failed to load your orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  // دالة لتحديد لون الحالة بناءً على حالة الطلب
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-emerald-500 shadow-emerald-200";
      case "shipped":
        return "bg-blue-500 shadow-blue-200";
      case "out for delivery":
        return "bg-amber-500 shadow-amber-200";
      default:
        return "bg-neutral-400 shadow-neutral-100";
    }
  };

  return (
    <div className="px-4 mt-24 sm:px-[6vw] md:px-[8vw] lg:px-[10vw] pt-12 pb-24 bg-white min-h-[80vh]">
      {/* Page Title */}
      <div className="mb-10 text-center sm:text-left">
        <Title text1={"MY"} text2={"ORDERS"} />
        <p className="text-xs text-gray-400 tracking-widest uppercase mt-1">
          Track and manage your luxury acquisitions
        </p>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : orderData.length === 0 ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center text-center gap-4">
          <p className="text-gray-500 text-sm">You have no active orders yet.</p>
        </div>
      ) : (
        /* Orders List */
        <div className="flex flex-col gap-6">
          {orderData.map((item, index) => (
            <div
              key={index}
              className="p-6 border border-gray-100 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
            >
              {/* Product Info */}
              <div className="flex items-start gap-5 text-sm">
                <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                  <img
                    src={item.image[0]}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-between h-full py-0.5">
                  <div>
                    <h3 className="font-serif text-base sm:text-lg text-gray-900 font-medium">
                      {item.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500 tracking-wide">
                      <span className="font-semibold text-gray-900 text-sm">
                        {currency}{item.price}
                      </span>
                      <span>•</span>
                      <span>Qty: {item.quantity}</span>
                      {item.size && (
                        <>
                          <span>•</span>
                          <span>Size: {item.size}</span>
                        </>
                      )}
                      {item.color && (
                        <>
                          <span>•</span>
                          <span>Color: {item.color}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3 text-xs text-gray-400">
                    <p>
                      Date: <span className="text-gray-700 font-medium">{new Date(item.date).toDateString()}</span>
                    </p>
                    
                    {/* Payment Method Badge */}
                    <div className="flex items-center gap-1.5">
                      <span>Payment:</span>
                      <span className={`px-2.5 py-0.5 rounded-md font-semibold uppercase tracking-wider text-[10px] ${
                        item.paymentMethod?.toLowerCase() === 'instapay' 
                          ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                          : 'bg-gray-100 text-gray-800 border border-gray-200'
                      }`}>
                        {item.paymentMethod}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Status & Action */}
              <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 pt-4 md:pt-0 gap-4">
                <div className="flex items-center gap-2.5 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                  <span className={`w-2.5 h-2.5 rounded-full shadow-sm ${getStatusColor(item.status)} animate-pulse`}></span>
                  <p className="text-xs font-semibold tracking-wider uppercase text-gray-800">
                    {item.status}
                  </p>
                </div>

                <button
                  onClick={loadOrderData}
                  className="border border-gray-200 hover:border-black text-black px-6 py-2.5 text-xs font-semibold uppercase tracking-widest rounded-xl transition-all hover:bg-black hover:text-white"
                >
                  Track Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;