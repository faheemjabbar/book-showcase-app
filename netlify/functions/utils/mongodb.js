const mongoose = require("mongoose");

let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }

  try {
    const MONGODB_URI =
      process.env.MONGODB_URI ||
      "mongodb+srv://bookuser:password7809@cluster0.qbrceig.mongodb.net/bookstore?retryWrites=true&w=majority&appName=Cluster0";

    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

module.exports = { connectToDatabase };
