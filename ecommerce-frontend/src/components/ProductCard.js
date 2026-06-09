import React from "react";
import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <div className="border rounded-lg shadow-lg overflow-hidden m-4 hover:shadow-xl transition-shadow duration-300">
      <Link to={`/products/${"{"}product._id{'}'}`}>
        <img
          src={product.imageUrl || "https://via.placeholder.com/300x200"}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
          <p className="text-gray-700 font-bold">${product.price.toFixed(2)}</p>
        </div>
      </Link>
    </div>
  );
}

export default ProductCard;
