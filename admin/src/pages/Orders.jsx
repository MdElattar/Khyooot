import React, { useEffect, useState } from "react";
import { assets } from "../assets/admin_assets/assets";
import axios from "axios";
import { currency } from "../App";
import { toast } from "react-toastify";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllOrders = async () => {
    if (!token) return;

    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data.message || "Failed to load orders");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const StatusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/order/status",
        { orderId, status: event.target.value },
        { headers: { token } }
      );
      if (response.data.success) {
        await fetchAllOrders();
        toast.success("Order status updated & timeline recorded");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-28 pb-20 bg-white min-h-screen">
      <div className="border-b border-gray-100 w-full pb-4 mb-8">
        <h2 className="text-xl font-black text-gray-950 uppercase tracking-wider">
          Customer Orders Portal
        </h2>
        <p className="text-xs text-gray-400 font-medium tracking-widest uppercase mt-0.5">
          Monitor acquisitions, update shipping status, and track fulfillment
        </p>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center text-center gap-4">
          <p className="text-gray-500 text-sm">No orders placed yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {orders.map((order, index) => (
            <div
              className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-6 items-start bg-white border border-gray-100 p-6 sm:p-8 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 text-xs sm:text-sm text-gray-700"
              key={index}
            >
              <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                <img className="w-6 opacity-80" src={assets.parcel_icon} alt="Parcel" />
              </div>

              <div className="space-y-3">
                <div className="space-y-1 pb-3 border-b border-gray-100">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-serif">
                      <span className="font-semibold text-gray-900">{item.name}</span>
                      <span className="text-gray-400">× {item.quantity}</span>
                      {item.size && (
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-[11px] font-sans text-gray-600">
                          Size: {item.size}
                        </span>
                      )}
                      {item.color && (
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-[11px] font-sans text-gray-600">
                          Color: {item.color}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <p className="font-bold text-gray-900 tracking-wide">
                    {`${order.address.firstName} ${order.address.lastName}`}
                  </p>
                  <p className="text-gray-500 mt-0.5 leading-relaxed">
                    {`${order.address.address}, ${order.address.city}, ${order.address.state}, ${order.address.country} - ${order.address.zip}`}
                  </p>
                  <p className="text-gray-900 font-medium mt-1">
                    Phone: <span className="text-gray-600">{order.address.phone}</span>
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-400">Method:</span>
                  <span className={`font-bold uppercase tracking-wider px-2 py-0.5 rounded text-[10px] ${
                    order.paymentMethod?.toLowerCase() === 'instapay'
                      ? 'bg-purple-100 text-purple-800 border border-purple-200'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {order.paymentMethod}
                  </span>
                </div>
                <p className="text-gray-500">
                  Payment: <span className={`font-semibold ${order.payment ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {order.payment ? "Done" : "Pending"}
                  </span>
                </p>
                <p className="text-gray-400">
                  Date: <span className="text-gray-700">{new Date(order.date).toLocaleDateString()}</span>
                </p>
              </div>

              <div>
                <p className="text-base font-black text-gray-950 font-serif">
                  {currency} {order.amount}
                </p>
              </div>

              <div>
                <select
                  onChange={(event) => StatusHandler(event, order._id)}
                  value={order.status}
                  className="w-full px-3.5 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold uppercase tracking-wider text-gray-900 outline-none focus:border-gray-900 focus:bg-white transition-all shadow-sm cursor-pointer"
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Packing">Packing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Canceled">Canceled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;