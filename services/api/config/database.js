const mongoose = require('mongoose');

// Atlas fallback connection — use MONGODB_URI env var, or set ATLAS_URI for M0 clusters
// Atlas M0 example: mongodb+srv://<user>:<pass>@clusterkgc.zs7xajg.mongodb.net/african_realestate?retryWrites=true&w=majority
const ATLAS_FALLBACK = process.env.ATLAS_URI || '';

const connectDB = async () => {
  try {
    // Prefer explicit ATLAS_URI over MONGODB_URI (avoids Render blueprint override issues)
    const uri = ATLAS_FALLBACK || process.env.MONGODB_URI || 'mongodb://localhost:27017/african-realestate';
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;