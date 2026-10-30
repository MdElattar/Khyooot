import { useState } from "react";
import { assets } from "../assets/admin_assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Hoddies");
  const [bestseller, setBestSeller] = useState(false);
  const [sizes, setSizes] = useState([]);
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
    setSizes((prev) =>
      prev.includes(size)
        ? prev.filter((item) => item !== size)
        : [...prev, size]
    );
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

  const inputStyle = "w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm transition-all outline-none focus:border-gray-900 focus:bg-white shadow-sm";

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full items-start gap-8 max-w-4xl mx-auto pt-28 pb-20 px-4 sm:px-8 bg-white"
    >
      {/* Section Header */}
      <div className="border-b border-gray-100 w-full pb-4">
        <h2 className="text-xl font-black text-gray-950 uppercase tracking-wider">
          Add New Product
        </h2>
        <p className="text-xs text-gray-400 font-medium tracking-widest uppercase mt-0.5">
          Upload product assets and luxury specifications
        </p>
      </div>

      {/* Upload Images */}
      <div className="w-full">
        <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
          Upload Product Images (Max 4)
        </p>
        <div className="flex flex-wrap gap-4">
          {[image1, image2, image3, image4].map((img, index) => {
            const id = `image${index + 1}`;
            const setImage = [setImage1, setImage2, setImage3, setImage4][index];
            return (
              <label
                key={id}
                htmlFor={id}
                className="w-24 h-28 border-2 border-dashed border-gray-200 hover:border-gray-900 rounded-2xl overflow-hidden cursor-pointer flex items-center justify-center bg-gray-50 transition-all duration-300 shadow-xs"
              >
                <img
                  className="w-full h-full object-cover"
                  src={!img ? assets.upload_area : URL.createObjectURL(img)}
                  alt="Upload preview"
                />
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
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
          Product Name
        </label>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className={inputStyle}
          type="text"
          placeholder="e.g., Luxury Oversized Hoodie"
          required
        />
      </div>

      {/* Product Description */}
      <div className="w-full">
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
          Product Description
        </label>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className={`${inputStyle} h-32 resize-none`}
          placeholder="Write detailed product features and materials here..."
          required
        />
      </div>

      {/* Category, Sub Category & Price */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Product Category
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
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Sub Category
          </label>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            value={subCategory}
            className={inputStyle}
          >
            <option value="Hoddies">Hoodies</option>
            <option value="TShirts">T-Shirts</option>
            <option value="Babytees">Baby Tees</option>
            <option value="Pants">Pants</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Product Price (L.E)
          </label>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className={inputStyle}
            type="number"
            placeholder="800"
            required
          />
        </div>
      </div>

      {/* Product Sizes */}
      <div className="w-full">
        <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
          Product Sizes
        </p>
        <div className="flex gap-3">
          {["XS", "S", "M", "L"].map((size) => (
            <div
              key={size}
              onClick={() => toggleSize(size)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider cursor-pointer border transition-all duration-300 ${
                sizes.includes(size)
                  ? "bg-gray-950 text-white border-gray-950 shadow-md"
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-400"
              }`}
            >
              {size}
            </div>
          ))}
        </div>
      </div>

      {/* Product Colors */}
      <div className="w-full">
        <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
          Product Colors
        </p>
        <div className="flex flex-wrap gap-3">
          {["Black", "White", "Baby Blue", "Burghandy", "Pink"].map((color) => (
            <div
              key={color}
              onClick={() => toggleColor(color)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider cursor-pointer border transition-all duration-300 ${
                colors.includes(color)
                  ? "bg-gray-950 text-white border-gray-950 shadow-md"
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-400"
              }`}
            >
              {color}
            </div>
          ))}
        </div>
      </div>

      {/* Winter Collection Checkbox */}
      <div className="flex items-center gap-3 pt-2">
        <input
          type="checkbox"
          id="bestseller"
          checked={bestseller}
          onChange={() => setBestSeller((prev) => !prev)}
          className="w-5 h-5 accent-gray-950 cursor-pointer rounded-md"
        />
        <label className="cursor-pointer text-xs font-bold text-gray-800 uppercase tracking-wider" htmlFor="bestseller">
          Add to Winter Collection (Bestseller / Featured)
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full sm:w-48 py-4 rounded-2xl font-bold uppercase tracking-wider text-xs transition-all duration-300 shadow-xl flex items-center justify-center gap-2 mt-4 ${
          loading
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-gray-950 text-white hover:bg-black shadow-black/15 hover:scale-[1.01]"
        }`}
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          "Add Product"
        )}
      </button>
    </form>
  );
};

export default Add;