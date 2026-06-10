// src/pages/OrderHistoryPage.js
import React, { useState, useEffect } from "react";
import { mockOrders } from "../mockData/orders"; // Import mock data
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../store/authSlice"; // Assuming you have this selector

// Helper component to display individual order items
function OrderItem({ order }) {
  const formattedDate = new Date(order.orderDate).toLocaleDateString();

  return (
    <div class="border rounded-lg p-4 mb-6 shadow hover:shadow-lg transition-shadow duration-300">
      <div class="flex justify-between items-center mb-4">
        <span class="font-semibold">Order ID: #{order._id.substring(4)}</span>
        <span class="text-sm text-gray-600">{formattedDate}</span>
      </div>
      <div class="mb-4">
        {order.items.map((item) => (
          <p key={item.productId} class="text-sm text-gray-700">
            {item.quantity} x {item.name} - ${item.price.toFixed(2)}
          </p>
        ))}
      </div>
      <div class="flex justify-between items-center pt-4 border-t">
        <span class="font-semibold">
          Total: ${order.totalAmount.toFixed(2)}
        </span>
        <span class="text-sm font-medium py-1 px-3 rounded-full bg-green-100 text-green-800">
          {order.status}
        </span>
      </div>
    </div>
  );
}

function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate fetching data
    const fetchOrders = async () => {
      setLoading(true);
      // In a real app, you would use axiosInstance.get('/orders') here
      // For simulation, we just use the mock data
      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        setOrders(mockOrders);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        // Handle error appropriately
      } finally {
        setLoading(false);
      }
    };

    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate("/login");
    } else {
      fetchOrders();
    }
  }, [isAuthenticated, navigate]);

  if (loading) {
    return <div class="text-center py-20">Loading your orders...</div>;
  }

  return (
    <div class="container mx-auto p-4">
      <h1 class="text-4xl font-bold text-center my-8">Order History</h1>
      {orders.length === 0 ? (
        <p class="text-center text-xl">You have no past orders.</p>
      ) : (
        orders.map((order) => <OrderItem key={order._id} order={order} />)
      )}
    </div>
  );
}

export default OrderHistoryPage;
