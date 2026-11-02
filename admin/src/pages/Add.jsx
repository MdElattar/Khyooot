import { useState } from "react";
import { assets } from "../assets/admin_assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Hoodies");
  const [bestseller, setBestSeller] = useState(false);
  
  const availableSizes = ["XS", "S", "M", "L", "XL"];
  const [sizes, setSizes] = useState([]);
  const [sizesStock, setSizesStock] = useState({});

  const availableColors = ["Black", "White", "Baby Blue", "Burghandy", "Pink", "Grey", "Navy", "Beige"];
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleColor = (color) => {
    setColors((prev) =>
      prev.includes(color)
        ? prev.filter((item) => item !== color)
        : [...prev, color]
    );
  };

  const toggleSize = (size) => {
    setSizes((prev) => {
      if (prev.includes(size)) {
        const updatedStock = { ...sizesStock };
        delete updatedStock[size];
        setSizesStock(updatedStock);
        return prev.filter((item) => item !== size);
      } else {
        return [...prev, size];
      }
    });
  };

  const handleSizeStockChange = (size, value) => {
    setSizesStock((prev) => ({
      ...prev,
      [size]: value === "" ? "" : Number(value)
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("colors", JSON.stringify(colors));
      formData.append("sizesStock", JSON.stringify(sizesStock));

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setDescription("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice("");
        setSizes([]);
        setColors([]);
        setSizesStock({});
      } else {
        toast.error(response.data.message || "Complete The Empty Inputs");
      }
    } catch (error) {
      console.error("ERROR:", error.response?.data || error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm transition-all outline-none focus:border-gray-900 focus:bg-white shadow-xs";

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full items-start gap-8 max-w-5xl mx-auto pt-28 pb-20 px-6 sm:px-10 bg-white min-h-screen"
    >
      {/* Page Header */}
      <div className="border-b border-gray-100 w-full pb-5">
        <h2 className="text-2xl font-black text-gray-950 uppercase tracking-tight">
          Add New Product Inventory
        </h2>
        <p className="text-xs text-gray-400 font-semibold tracking-widest uppercase mt-1">
          Configure size quantities, colorways, and high-end luxury assets
        </p>
      </div>

      {/* Upload Images Section */}
      <div className="w-full">
        <p className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">
          Upload Product Assets (Max 4 Images)
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[image1, image2, image3, image4].map((img, index) => {
            const id = `image${index + 1}`;
            const setImage = [setImage1, setImage2, setImage3, setImage4][index];
            return (
              <label
                key={id}
                htmlFor={id}
                className="w-full aspect-[3/4] border-2 border-dashed border-gray-200 hover:border-gray-900 rounded-2xl overflow-hidden cursor-pointer flex flex-col items-center justify-center bg-gray-50 transition-all duration-300 shadow-xs group"
              >
                {img ? (
                  <img className="w-full h-full object-cover" src={URL.createObjectURL(img)} alt="Upload preview" />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <img className="w-8 h-8 opacity-40 group-hover:opacity-80 transition-opacity" src={assets.upload_area} alt="Upload" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-gray-900">Upload</span>
                  </div>
                )}
                <input
                  onChange={(e) => setImage(e.target.files[0])}
                  type="file"
                  id={id}
                  hidden
                  accept="image/*"
                />
              </label>
            );
          })}
        </div>
      </div>

      {/* Product Name */}
      <div className="w-full">
        <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
          Product Name
        </label>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className={inputStyle}
          type="text"
          placeholder="e.g., Khyoot Arabian Weave Hoodie"
          required
        />
      </div>

      {/* Product Description */}
      <div className="w-full">
        <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
          Product Description & Story
        </label>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className={`${inputStyle} h-36 resize-none`}
          placeholder="Write detailed product features, materials, and luxury specifications here..."
          required
        />
      </div>

      {/* Category, Sub Category & Price */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
        <div>
          <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
            Category
          </label>
          <select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            className={inputStyle}
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
            Sub Category
          </label>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            value={subCategory}
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
          <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
            Price (L.E)
          </label>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className={inputStyle}
            type="number"
            placeholder="900"
            required
          />
        </div>
      </div>

      {/* Product Sizes (XS to XL) & Quantities */}
      <div className="w-full bg-gray-50/60 p-6 rounded-3xl border border-gray-100">
        <p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
          Select Available Sizes (XS to XL) & Quantities
        </p>
        <div className="flex flex-wrap gap-3">
          {availableSizes.map((size) => (
            <div
              key={size}
              onClick={() => toggleSize(size)}
              className={`h-12 px-6 rounded-2xl text-xs font-bold tracking-wider cursor-pointer border flex items-center justify-center transition-all duration-300 ${
                sizes.includes(size)
                  ? "bg-black text-white border-black shadow-md scale-105"
                  : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
              }`}
            >
              {size}
            </div>
          ))}
        </div>

        {/* Quantities Inputs */}
        {sizes.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200/60 grid grid-cols-2 sm:grid-cols-5 gap-4">
            {sizes.map((size) => (
              <div key={size} className="bg-white p-3 rounded-2xl border border-gray-200">
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                  Stock for {size}
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={sizesStock[size] ?? ""}
                  onChange={(e) => handleSizeStockChange(size, e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none focus:border-black"
                  required
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Colors */}
      <div className="w-full">
        <p className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">
          Product Colorways
        </p>
        <div className="flex flex-wrap gap-3">
          {availableColors.map((color) => (
            <div
              key={color}
              onClick={() => toggleColor(color)}
              className={`h-11 px-5 rounded-2xl text-xs font-bold tracking-wider cursor-pointer border flex items-center justify-center transition-all duration-300 ${
                colors.includes(color)
                  ? "bg-black text-white border-black shadow-md"
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-400"
              }`}
            >
              {color}
            </div>
          ))}
        </div>
      </div>

      {/* Winter Collection Checkbox */}
      <div className="flex items-center gap-3 pt-2 bg-gray-50 w-full p-4 rounded-2xl border border-gray-100">
        <input
          type="checkbox"
          id="bestseller"
          checked={bestseller}
          onChange={() => setBestSeller((prev) => !prev)}
          className="w-5 h-5 accent-black cursor-pointer rounded-md"
        />
        <label className="cursor-pointer text-xs font-bold text-gray-900 uppercase tracking-wider" htmlFor="bestseller">
          Feature in Winter Collection / Bestseller Showcase
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full sm:w-56 py-4 rounded-2xl font-bold uppercase tracking-wider text-xs transition-all duration-300 shadow-xl flex items-center justify-center gap-2 mt-4 ${
          loading
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-black text-white hover:bg-neutral-800 shadow-black/20 hover:scale-[1.01]"
        }`}
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          "Publish Product"
        )}
      </button>
    </form>
  );
};

Add.displayName = "Add";

export default Add;