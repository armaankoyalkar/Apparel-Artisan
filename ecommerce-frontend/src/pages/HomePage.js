import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  const features = [
    { icon: '🎨', title: 'Artist Designed', desc: 'Every piece crafted by independent artists' },
    { icon: '👕', title: 'Premium Quality', desc: 'Soft, durable materials that last' },
    { icon: '🚚', title: 'Fast Shipping', desc: 'Delivered to your door worldwide' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gray-900 text-white py-24 px-4 text-center">
        <h1 className="text-5xl font-bold mb-4 text-yellow-400">
          Apparel Artisan
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Discover unique, artist-designed apparel. Wear your personality with
          fashion that tells a story.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/products"
            className="bg-yellow-400 text-black px-8 py-3 rounded-full text-lg font-semibold hover:bg-yellow-500 transition"
          >
            Shop Now
          </Link>
          <Link
            to="/register"
            className="border border-yellow-400 text-yellow-400 px-8 py-3 rounded-full text-lg font-semibold hover:bg-yellow-400 hover:text-black transition"
          >
            Join Us
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
          Why Choose Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="text-center p-6 bg-white rounded-xl shadow hover:shadow-md transition"
            >
              <div className="text-5xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-yellow-400 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">
          Ready to Express Yourself?
        </h2>
        <p className="text-gray-800 mb-6">
          Browse our full collection of artist-designed apparel
        </p>
        <Link
          to="/products"
          className="bg-gray-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition"
        >
          View Collection
        </Link>
      </div>
    </div>
  );
}

export default HomePage;