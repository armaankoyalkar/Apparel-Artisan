const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

require("dotenv").config();
const connectDB = require("./config/db");
const Product = require("./models/Product");
const products = [
  { name: "Midnight Botanical Tee", description: "A soft heavyweight tee with a hand-drawn botanical print.", price: 32, countInStock: 18, imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80", category: "T-Shirts", brand: "Apparel Artisan", sizes: ["S", "M", "L", "XL"] },
  { name: "Studio Blue Hoodie", description: "A brushed-fleece hoodie with a relaxed fit for cool studio mornings.", price: 68, countInStock: 12, imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80", category: "Hoodies", brand: "Apparel Artisan", sizes: ["S", "M", "L", "XL"] },
  { name: "Canvas Work Jacket", description: "A structured cotton jacket made for layering through every season.", price: 94, countInStock: 8, imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80", category: "Outerwear", brand: "Apparel Artisan", sizes: ["M", "L", "XL"] },
  { name: "Sunset Sketch Cap", description: "An embroidered six-panel cap with an adjustable brass clasp.", price: 26, countInStock: 22, imageUrl: "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&q=80", category: "Accessories", brand: "Apparel Artisan", sizes: ["One size"] },
];
const seed = async () => {
  await connectDB();
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log("Sample products created.");
  process.exit(0);
};
seed().catch((error) => {
  console.error("Seed Error:", error);
  process.exit(1);
});
