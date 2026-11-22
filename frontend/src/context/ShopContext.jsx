import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// 1. Create the Context object
export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  // Define the global state variables
  const currency = "L.E ";
  const delivery_fee = 80;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const [cartItems, setCartItems] = useState({});


   const getUserCart = async () => {
    if (!token) return;

    try {
      const res = await axios.post(
        `${backendUrl}/api/cart/get`,
        {},
        {
          headers: { authorization: token },
        }
      );

      if (res.data.success) {
        const cartObject = {};

        res.data.cart.items.forEach((item) => {
          cartObject[item.variantId] = {
            productId: item.productId,
            size: item.size,
            color: item.color,
            count: item.count,
          };
        });

        setCartItems(cartObject);
      }
    } catch (error) {
      console.log("Get cart failed with status", error.response?.status);
    }
  };


 const addToCart = async (productId, size, color) => {
    if (!token) return;
    if (!size) {
      toast.error("Please Select Size")
    }
    if (!color) {
      toast.error("Please Select Color")
    }

    try {
      const res = await axios.post(
        `${backendUrl}/api/cart/add`,
        { productId, size, color },
        {
          headers: { authorization: token },
        }
      );

      if (res.data.success) {
        getUserCart(); // sync after add
      }
    } catch (error) {
      console.log("Add to cart failed with status", error.response?.status);
    }
    toast.success("Product Added ")
  };


const updateCart = async (variantId, action) => {
    if (!token) return;

    try {
      const res = await axios.post(
        `${backendUrl}/api/cart/update`,
        { variantId, action },
        {
          headers: { authorization: token },
        }
      );

      if (res.data.success) {
        getUserCart(); // sync after update
      }
    } catch (error) {
      console.log("Update cart failed with status", error.response?.status);
    }
  };


  // --- GET CART COUNT FUNCTION ---
  // This function correctly sums ONLY the 'count' property of each item.
  const getCartCount = () => {
    let totalCount = 0;

    // itemId is the key (the unique product ID)
    for (const itemId in cartItems) {
      const itemObject = cartItems[itemId];

      // Directly access the property that holds the quantity: "count"
      if (itemObject && itemObject.count > 0) {
        totalCount += itemObject.count;
      }
    }

    return totalCount;
  };

const getCartAmount = () => {
    // Cart entries use { productId, size, color, count } and keys are
    // "<productId>_<size>_<color>". Price comes from the catalog only.
    let totalAmount = 0;
    for (const [variantId, entry] of Object.entries(cartItems)) {
        const productId = variantId.split('_')[0];
        const itemInfo = products.find((product) => product._id === productId);
        const count = Number(entry?.count);
        if (itemInfo && Number.isFinite(count) && count > 0) {
            totalAmount += Number(itemInfo.price) * count;
        }
    }
    return totalAmount;
};


// Make sure to add it to the 'value' object at the bottom of the file

  const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("Request failed with status", error.response?.status);
      toast.error(error.message);
    }
  };
  useEffect(() => {
    getProductsData();
  }, []);

 

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }
  });

  // Inside ShopContext.jsx
useEffect(() => {
    if (token) {
        getUserCart(); // Fetch saved items from database when user logs in
    }
}, [token]);


  // The value object holds all state/data to be passed down
  const value = {
    products,
    currency,
    delivery_fee,
    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    getCartAmount,
    updateCart,
    navigate,
    backendUrl,
    setToken,
    token,

    // ... other state, like cart items, functions, etc., would go here
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
