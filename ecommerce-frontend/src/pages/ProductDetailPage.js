import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../store/productSlice';
import { addItem } from '../store/cartSlice';
import LoadingSpinner from '../components/LoadingSpinner';

function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentProduct: product, loading, error } = useSelector((s) => s.products);
  const [added, setAdded] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [id, dispatch]);

  const handleAddToCart = () => {
    dispatch(addItem(product));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-center text-red-500 py-20">{error}</p>;
  if (!product) return null;

  return (
    <div className="container mx-auto px-4 py-10">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-gray-500 hover:text-gray-800 flex items-center gap-1"
      >
        ← Back
      </button>

      <div className="flex flex-col md:flex-row gap-10 bg-white rounded-xl shadow p-6">
        <img
          src={product.imageUrl || 'https://via.placeholder.com/500?text=No+Image'}
          alt={product.name}
          className="w-full md:w-1/2 rounded-xl object-cover h-96"
        />

        <div className="flex-1">
          <p className="text-yellow-500 text-sm font-semibold mb-1">
            {product.category} · {product.brand}
          </p>
          <h2 className="text-3xl font-bold mb-3 text-gray-800">{product.name}</h2>
          <p className="text-3xl text-yellow-500 font-bold mb-4">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

          {/* Sizes */}
          <div className="mb-6">
            <p className="font-semibold mb-2">Select Size:</p>
            <div className="flex gap-2 flex-wrap">
              {product.sizes?.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`border px-4 py-2 rounded-lg font-medium transition ${
                    selectedSize === s
                      ? 'bg-yellow-400 border-yellow-400 text-black'
                      : 'border-gray-300 hover:border-yellow-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Stock */}
          <p className={`text-sm mb-4 font-medium ${product.countInStock > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {product.countInStock > 0
              ? `✓ ${product.countInStock} items in stock`
              : '✗ Out of stock'}
          </p>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={product.countInStock === 0}
            className={`w-full py-3 rounded-xl font-semibold text-lg transition ${
              product.countInStock === 0
                ? 'bg-gray-200 cursor-not-allowed text-gray-400'
                : added
                ? 'bg-green-500 text-white'
                : 'bg-yellow-400 hover:bg-yellow-500 text-black'
            }`}
          >
            {added ? '✓ Added to Cart!' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;