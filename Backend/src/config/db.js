const mongoose = require('mongoose');
const dns = require('dns');

// Fix for Node 17+ DNS resolution issues on cloud environments like Render
try {
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {
  // Ignored
}

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('ERROR: MONGO_URI environment variable is not defined!');
      console.error('Make sure MONGO_URI is set in your Render Environment Variables or .env file.');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('MongoDB connected Successfully');
  } catch (error) {
    console.log('MongoDB Connection failed:', error.message);

    // If DNS SRV query failed (common on Render / Node 18+), retry with Google DNS fallback
    if (error.message.includes('querySrv ENOTFOUND') || error.message.includes('querySrv EREFUSED')) {
      console.log('Retrying MongoDB connection with Google/Cloudflare public DNS...');
      try {
        dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected Successfully (via fallback DNS)');
        return;
      } catch (retryErr) {
        console.log('Fallback connection attempt also failed:', retryErr.message);
      }
    }
    process.exit(1);
  }
};

module.exports = connectDB;