// src/pages/ProductListPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await axios.get("http://localhost:5000/api/products");
        setProducts(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to load products.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div class="text-center py-20">Loading products...</div>;
  if (error) return <div class="text-center py-20 text-red-500">{error}</div>;

  return (
    <div class="container mx-auto p-4">
      <h1 class="text-4xl font-bold text-center my-8">Our Products</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <p class="text-center text-gray-600 col-span-full">
            No products available.
          </p>
        )}
      </div>
    </div>
  );
}

export default ProductListPage;
