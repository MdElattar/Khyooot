import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import { toast } from "react-toastify";

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // حالة التحكم في نافذة الـ Tracking Modal الفاخرة
  const [selectedOrder, setSelectedOrder] = useState(null);

  const trackingSteps = [
    { key: "Order Placed", label: "Order Confirmed", desc: "Your order has been received by KHYOOT." },
    { key: "Packing", label: "Crafting & Packing", desc: "Inspecting quality and preparing luxury packaging." },
    { key: "Shipped", label: "Handed to Courier", desc: "Package dispatched to the delivery network." },
    { key: "Out for delivery", label: "Out For Delivery", desc: "Courier is arriving at your specified destination." },
    { key: "Delivered", label: "Delivered", desc: "Package successfully handed over." }
  ];

  const loadOrderData = async () => {
    try {
      if (!token) return;

      const response = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        setOrders(response.data.orders.reverse());
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

  const getStatusStepIndex = (status) => {
    return trackingSteps.findIndex(s => s.key.toLowerCase() === status?.toLowerCase());
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-emerald-500 shadow-emerald-200";
      case "shipped":
        return "bg-blue-500 shadow-blue-200";
      case "out for delivery":
        return "bg-amber-500 shadow-amber-200";
      case "canceled":
        return "bg-red-500 shadow-red-200";
      default:
        return "bg-neutral-800 shadow-neutral-200";
    }
  };

  return (
    <div className="px-4 mt-24 sm:px-[6vw] md:px-[8vw] lg:px-[10vw] pt-12 pb-24 bg-white min-h-[80vh]">
      <div className="mb-10 text-center sm:text-left">
        <Title text1={"MY"} text2={"ORDERS"} />
        <p className="text-xs text-gray-400 tracking-widest uppercase mt-1">
          Track and manage your luxury acquisitions
        </p>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center text-center gap-4">
          <p className="text-gray-500 text-sm">You have no active orders yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order, index) => (
            <div
              key={index}
              className="p-6 border border-gray-100 bg-white rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-6"
            >
              {/* Order Header Summary */}
              <div className="flex flex-wrap items-center justify-between pb-4 border-b border-gray-100 gap-4 text-xs">
                <div>
                  <span className="text-gray-400 uppercase tracking-widest font-semibold">Order ID:</span>
                  <span className="ml-2 font-mono font-bold text-gray-900">#{order._id.slice(-8).toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-400">Date: <strong className="text-gray-800">{new Date(order.date).toLocaleDateString()}</strong></span>
                  <span className="text-gray-400">Total: <strong className="text-black font-serif text-sm">{currency}{order.amount}</strong></span>
                </div>
              </div>

              {/* Items List */}
              <div className="flex flex-col gap-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                        <img src={item.image[0]} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-serif text-sm font-semibold text-gray-900">{item.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {currency}{item.price} • Qty: {item.quantity} {item.size && `• Size: ${item.size}`} {item.color && `• Color: ${item.color}`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Status and Live Track Button */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2.5 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                  <span className={`w-2.5 h-2.5 rounded-full shadow-sm ${getStatusColor(order.status)} animate-pulse`}></span>
                  <p className="text-xs font-semibold tracking-wider uppercase text-gray-800">
                    {order.status}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedOrder(order)}
                  className="bg-black hover:bg-neutral-800 text-white px-6 py-2.5 text-xs font-semibold uppercase tracking-widest rounded-xl transition-all shadow-sm hover:scale-[1.02]"
                >
                  Live Timeline Track ➔
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Luxury Timeline Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-6">
              <div>
                <h3 className="text-lg font-black uppercase tracking-wider text-gray-950">Shipment Timeline</h3>
                <p className="text-xs text-gray-400 mt-0.5">Order #{selectedOrder._id.slice(-8).toUpperCase()}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold text-sm transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Timeline Steps */}
            <div className="relative pl-6 border-l-2 border-gray-100 space-y-8 my-4 ml-4">
              {trackingSteps.map((step, idx) => {
                const currentIdx = getStatusStepIndex(selectedOrder.status);
                const isCompleted = currentIdx >= idx;
                const isCurrent = currentIdx === idx;
                
                // البحث عن تاريخ تغيير هذه الحالة
                const historyRecord = selectedOrder.statusHistory?.find(
                  h => h.status.toLowerCase() === step.key.toLowerCase()
                );

                return (
                  <div key={step.key} className="relative">
                    {/* Step Bullet Dot */}
                    <span
                      className={`absolute -left-[31px] top-0 w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
                        isCompleted
                          ? "bg-black border-black text-white"
                          : "bg-white border-gray-300"
                      } ${isCurrent ? "ring-4 ring-black/10 scale-125" : ""}`}
                    >
                      {isCompleted && <span className="text-[10px] font-bold">✓</span>}
                    </span>

                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className={`text-xs font-bold uppercase tracking-wider ${isCompleted ? "text-gray-950" : "text-gray-400"}`}>
                          {step.label}
                        </h4>
                        {historyRecord && (
                          <span className="text-[10px] font-mono text-gray-400">
                            {new Date(historyRecord.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Close Tracking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;