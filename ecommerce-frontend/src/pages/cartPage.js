// src/pages/CartPage.js
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  selectCartItems,
  selectCartTotalPrice,
  removeItem,
  updateQuantity,
} from "../store/cartSlice";

function CartPage() {
  const cartItems = useSelector(selectCartItems);
  const totalPrice = useSelector(selectCartTotalPrice);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleQuantityChange = (productId, newQuantity) => {
    dispatch(updateQuantity({ productId, quantity: newQuantity }));
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeItem(productId));
  };

  const handleCheckout = () => {
    // In a real app, this would initiate the checkout process
    // For now, we'll just navigate to a placeholder or login page
    alert("Proceeding to checkout! (This feature is simulated)");
    navigate("/checkout"); // Assuming a /checkout route exists or will be created
  };

  return (
    <div class="container mx-auto p-4">
      <h1 class="text-4xl font-bold text-center my-8">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div class="text-center py-20">
          <p class="text-xl mb-4">Your cart is empty.</p>
          <Link to="/products" class="text-blue-600 hover:underline">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Header Row */}
            <div class="font-semibold text-lg col-span-2">Product</div>
            <div class="font-semibold text-lg text-right">Price</div>
          </div>

          {cartItems.map((item) => (
            <div
              key={item.product._id}
              class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center mb-6 border-b pb-4"
            >
              <div class="flex items-center col-span-2">
                <img
                  src={
                    item.product.imageUrl || "https://via.placeholder.com/80x80"
                  }
                  alt={item.product.name}
                  class="w-20 h-20 object-cover rounded mr-4"
                />
                <div>
                  <h3 class="font-semibold">{item.product.name}</h3>
                  <p class="text-sm text-gray-600">
                    ${item.product.price.toFixed(2)}
                  </p>
                  <div class="flex items-center mt-2">
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          item.product._id,
                          item.quantity - 1,
                        )
                      }
                      class="px-2 py-1 border rounded-l hover:bg-gray-200"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          item.product._id,
                          parseInt(e.target.value, 10),
                        )
                      }
                      class="w-16 text-center border-t border-b mx-1"
                      min="1"
                    />
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          item.product._id,
                          item.quantity + 1,
                        )
                      }
                      class="px-2 py-1 border rounded-r hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <div class="text-right font-semibold">
                ${(item.product.price * item.quantity).toFixed(2)}
              </div>
              <button
                onClick={() => handleRemoveItem(item.product._id)}
                class="text-red-600 hover:text-red-800 font-semibold text-sm md:text-right col-span-full md:col-span-1"
              >
                Remove
              </button>
            </div>
          ))}

          <div class="text-right mt-8 border-t pt-4">
            <h2 class="text-2xl font-bold">Total: ${totalPrice.toFixed(2)}</h2>
            <button
              onClick={handleCheckout}
              class="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold mt-4 hover:bg-green-700 transition-colors duration-300"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
