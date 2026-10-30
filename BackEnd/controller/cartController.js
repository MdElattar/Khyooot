import Cart from "../models/cartModel.js";
import User from "../models/userModel.js";


const syncCartToUser = async (userId, cart) => {
  const cartData = {};

  cart.items.forEach((item) => {
    cartData[item.variantId] = {
      productId: item.productId,
      size: item.size,
      color: item.color,
      count: item.count,
    };
  });

  await User.findByIdAndUpdate(userId, { cartData });
};

// ✅ GET USER CART
const getUserCart = async (req, res) => {
  try {
    const userId = req.user._id;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
  cart = await Cart.create({ userId, items: [] });
  await syncCartToUser(userId, cart);
}

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
  

};




// ✅ ADD TO CART
const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, size, color } = req.body;

    const variantId = `${productId}_${size}_${color}`;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.variantId === variantId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].count += 1;
    } else {
      cart.items.push({
        variantId,
        productId,
        size,
        color,
        count: 1,
      });
    }

   await cart.save();

// 🔥 SYNC HERE
await syncCartToUser(userId, cart);

res.json({ success: true, cart });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ UPDATE CART (increase / decrease / remove)
const updateCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { variantId, action } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.json({ success: false, message: "Cart not found" });

    const itemIndex = cart.items.findIndex(
      (item) => item.variantId === variantId
    );

    if (itemIndex === -1) {
      return res.json({ success: false, message: "Item not found" });
    }

    if (action === "increase") {
      cart.items[itemIndex].count += 1;
    }

    if (action === "decrease") {
      if (cart.items[itemIndex].count > 1) {
        cart.items[itemIndex].count -= 1;
      } else {
        cart.items.splice(itemIndex, 1);
      }
    }

    if (action === "remove") {
      cart.items.splice(itemIndex, 1);
    }

    // after cart.save();
await cart.save();

// 🔥 SYNC HERE
await syncCartToUser(userId, cart);

res.json({ success: true, cart });


    
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getUserCart, addToCart, updateCart };
