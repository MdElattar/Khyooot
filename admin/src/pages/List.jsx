import { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");

      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-28 pb-20 bg-white min-h-screen">
      {/* Page Title */}
      <div className="border-b border-gray-100 w-full pb-4 mb-8">
        <h2 className="text-xl font-black text-gray-950 uppercase tracking-wider">
          All Products Inventory
        </h2>
        <p className="text-xs text-gray-400 font-medium tracking-widest uppercase mt-0.5">
          Manage, view, and remove store items
        </p>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : list.length === 0 ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center text-center gap-4">
          <p className="text-gray-500 text-sm">No products found in inventory.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {/* ------- List Table Header ------- */}
          <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-3 px-6 bg-gray-50 rounded-2xl text-xs font-bold text-gray-700 uppercase tracking-wider border border-gray-100">
            <span>Image</span>
            <span>Product Name</span>
            <span>Category</span>
            <span>Price</span>
            <span className="text-center">Action</span>
          </div>

          {/* ------- Product List Cards ------- */}
          {list.map((item, index) => (
            <div
              className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all duration-300"
              key={index}
            >
              {/* Product Image */}
              <div className="w-14 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                <img
                  className="w-full h-full object-cover"
                  src={item.image[0]}
                  alt={item.name}
                />
              </div>

              {/* Product Name */}
              <p className="font-serif font-medium text-gray-900 text-sm sm:text-base">
                {item.name}
              </p>

              {/* Category */}
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg w-fit border border-gray-100">
                {item.category}
              </p>

              {/* Price */}
              <p className="font-bold text-gray-900 text-sm">
                {currency} {item.price}
              </p>

              {/* Delete Action Button */}
              <div className="text-right md:text-center">
                <button
                  onClick={() => removeProduct(item._id)}
                  title="Remove Product"
                  className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-600 border border-gray-200 hover:border-red-200 transition-all duration-300 inline-flex items-center justify-center font-bold text-xs"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default List;