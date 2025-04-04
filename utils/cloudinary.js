console.log("🟢 Cloudinary.js file is running...");

const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

// **Load environment variables**
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// **Debugging - Print Environment Variables**
console.log("Loaded Cloudinary Config:");
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY ? "✅ Loaded" : "❌ Missing");
console.log("API Secret:", process.env.CLOUDINARY_API_SECRET ? "✅ Loaded" : "❌ Missing");

module.exports = cloudinary;
