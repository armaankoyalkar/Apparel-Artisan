// Import necessary modules 
require('dotenv').config(); // Load environment variables from .env file 
const express = require('express'); 
const app = express(); 
// Use environment variable or default to 5000 
const PORT = process.env.PORT || 5000;  
// // Middleware to parse JSON request bodies 
app.use(express.json());  // Basic route for testing 
app.get('/', (req, res) => {   res.send('Welcome to the E-commerce Backend API!'); });  
// Start the server 
app.listen(PORT, () => {   console.log('Server is running on port ${PORT}'); });