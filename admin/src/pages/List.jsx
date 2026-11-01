import { useEffect, useState } from "react";
import axios from "axios";
import { currency } from "../App";
import { toast } from "react-toastify";

// تم تثبيت الرابط المحلي صراحة للتجربة والتطوير الفوري بدون مشاكل الـ Cache
const backendUrl = "http://localhost:4000";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal States
  const [editProduct, setEditProduct] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Hoodies");
  const [bestseller, setBestSeller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [updating, setUpdating] = useState(false);

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
    if (!window.confirm("Are you sure you want to remove this product?")) return;
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

  // Open Edit Modal & Populate Form
  const handleEditClick = (item) => {
    setEditProduct(item);
    setName(item.name);
    setDescription(item.description);
    setPrice(item.price);
    setStock(item.stock || 0);
    setCategory(item.category);
    setSubCategory(item.subCategory);
    setBestSeller(item.bestseller || false);
    setSizes(item.sizes || []);
    setColors(item.colors || []);
  };

  const toggleSize = (size) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color) => {
    setColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const response = await axios.post(
        backendUrl + "/api/product/update",
        {
          id: editProduct._id,
          name,
          description,
          price,
          stock,
          category,
          subCategory,
          bestseller,
          sizes,
          colors,
        },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setEditProduct(null);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const inputStyle =
    "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-gray-900 focus:bg-white";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-28 pb-20 bg-white min-h-screen relative">
      {/* Page Title */}
      <div className="border-b border-gray-100 w-full pb-4 mb-8">
        <h2 className="text-xl font-black text-gray-950 uppercase tracking-wider">
          All Products Inventory
        </h2>
        <p className="text-xs text-gray-400 font-medium tracking-widest uppercase mt-0.5">
          Manage, view, edit, and remove store items
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
          {/* List Table Header */}
          <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1.5fr] items-center py-3 px-6 bg-gray-50 rounded-2xl text-xs font-bold text-gray-700 uppercase tracking-wider border border-gray-100">
            <span>Image</span>
            <span>Product Name</span>
            <span>Category</span>
            <span>Price</span>
            <span>Stock</span>
            <span className="text-center">Actions</span>
          </div>

          {/* Product List Cards */}
          {list.map((item, index) => (
            <div
              className="grid grid-cols-[1fr_2fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1.5fr] items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all duration-300"
              key={index}
            >
              <div className="w-14 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                <img
                  className="w-full h-full object-cover"
                  src={item.image[0]}
                  alt={item.name}
                />
              </div>

              <p className="font-serif font-medium text-gray-900 text-sm sm:text-base">
                {item.name}
              </p>

              <p className="text-xs font-semibold uppercase tracking-wider text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg w-fit border border-gray-100">
                {item.category}
              </p>

              <p className="font-bold text-gray-900 text-sm">
                {currency} {item.price}
              </p>

              <p className={`text-xs font-bold ${item.stock > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                {item.stock > 0 ? `${item.stock} in stock` : "Sold Out"}
              </p>

              {/* Action Buttons: Edit & Remove */}
              <div className="flex items-center justify-end md:justify-center gap-2">
                <button
                  onClick={() => handleEditClick(item)}
                  title="Edit Product"
                  className="px-3 py-2 rounded-xl bg-gray-900 text-white hover:bg-black transition-all text-xs font-bold uppercase tracking-wider shadow-xs"
                >
                  Edit
                </button>

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

      {/* ------- EDIT PRODUCT MODAL ------- */}
      {editProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center pb-4 mb-6 border-b border-gray-100">
              <h3 className="text-lg font-black text-gray-950 uppercase tracking-wider">
                Edit Product Details
              </h3>
              <button
                onClick={() => setEditProduct(null)}
                className="text-gray-400 hover:text-black font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="flex flex-col gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputStyle}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`${inputStyle} h-24 resize-none`}
                  required
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={inputStyle}
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Sub Category
                  </label>
                  <select
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    className={inputStyle}
                  >
                    <option value="Hoodies">Hoodies</option>
                    <option value="Crownecks">Crownecks</option>
                    <option value="Jackets">Jackets</option>
                    <option value="TShirts">T-Shirts</option>
                    <option value="Babetees">Babetees</option>
                    <option value="Pants">Pants</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Price (L.E)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className={inputStyle}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className={inputStyle}
                    required
                  />
                </div>
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                  Sizes
                </label>
                <div className="flex gap-2">
                  {["XS", "S", "M", "L"].map((sz) => (
                    <div
                      key={sz}
                      onClick={() => toggleSize(sz)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold cursor-pointer border ${
                        sizes.includes(sz)
                          ? "bg-black text-white border-black"
                          : "bg-gray-50 text-gray-700 border-gray-200"
                      }`}
                    >
                      {sz}
                    </div>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                  Colors
                </label>
                <div className="flex flex-wrap gap-2">
                  {["Black", "White", "Baby Blue", "Burghandy", "Pink"].map((col) => (
                    <div
                      key={col}
                      onClick={() => toggleColor(col)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold cursor-pointer border ${
                        colors.includes(col)
                          ? "bg-black text-white border-black"
                          : "bg-gray-50 text-gray-700 border-gray-200"
                      }`}
                    >
                      {col}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bestseller Checkbox */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="editBestseller"
                  checked={bestseller}
                  onChange={() => setBestSeller((prev) => !prev)}
                  className="w-5 h-5 accent-gray-950 cursor-pointer rounded-md"
                />
                <label
                  htmlFor="editBestseller"
                  className="cursor-pointer text-xs font-bold text-gray-800 uppercase"
                >
                  Winter Collection / Bestseller
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditProduct(null)}
                  className="px-6 py-3 rounded-xl border border-gray-200 text-xs font-bold uppercase text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-3 rounded-xl bg-black text-white text-xs font-bold uppercase hover:bg-neutral-800 shadow-md"
                >
                  {updating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;