import { createSlice } from '@reduxjs/toolkit';

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

// Save cart to localStorage
const saveCartToStorage = (items) => {
  try {
    localStorage.setItem('cartItems', JSON.stringify(items));
  } catch {
    console.error('Failed to save cart to localStorage');
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadCartFromStorage(), // Load from localStorage on start
  },
  reducers: {
    addItem: (state, action) => {
      const idx = state.items.findIndex(
        (i) => i.product._id === action.payload._id
      );
      if (idx > -1) {
        state.items[idx].quantity += 1;
      } else {
        state.items.push({ product: action.payload, quantity: 1 });
      }
      saveCartToStorage(state.items); // Save to localStorage
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(
        (i) => i.product._id !== action.payload
      );
      saveCartToStorage(state.items); // Save to localStorage
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const idx = state.items.findIndex((i) => i.product._id === productId);
      if (idx > -1) {
        if (quantity <= 0) {
          state.items.splice(idx, 1);
        } else {
          state.items[idx].quantity = quantity;
        }
      }
      saveCartToStorage(state.items); // Save to localStorage
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('cartItems'); // Clear from localStorage
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart } =
  cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) =>
  state.cart.items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.quantity, 0);

export default cartSlice.reducer;