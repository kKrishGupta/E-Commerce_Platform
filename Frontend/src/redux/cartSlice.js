import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
};

const saveCart = (cartItems) => {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
};

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    addToCart(state, action) {
      const product = action.payload;

      const existingItem = state.cartItems.find(
        (item) => item._id === product._id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cartItems.push({
          ...product,
          quantity: 1,
        });
      }

      saveCart(state.cartItems);
    },

    removeFromCart(state, action) {
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== action.payload
      );

      saveCart(state.cartItems);
    },

    increaseQuantity(state, action) {
      const item = state.cartItems.find(
        (item) => item._id === action.payload
      );

      if (item) {
        item.quantity += 1;
      }

      saveCart(state.cartItems);
    },

    decreaseQuantity(state, action) {
      const item = state.cartItems.find(
        (item) => item._id === action.payload
      );

      if (!item) return;

      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        state.cartItems = state.cartItems.filter(
          (cartItem) => cartItem._id !== action.payload
        );
      }

      saveCart(state.cartItems);
    },

    clearCart(state) {
      state.cartItems = [];
      state.cartTotalQuantity = 0;
      state.cartTotalAmount = 0;

      localStorage.removeItem("cartItems");
    },

    getTotals(state) {
      let totalQuantity = 0;
      let totalAmount = 0;

      state.cartItems.forEach((item) => {
        totalQuantity += item.quantity;
        totalAmount += item.price * item.quantity;
      });

      state.cartTotalQuantity = totalQuantity;
      state.cartTotalAmount = totalAmount;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  getTotals,
} = cartSlice.actions;

export default cartSlice.reducer;