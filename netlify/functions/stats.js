const { connectToDatabase } = require("./utils/mongodb");
const Book = require("./models/Book");

// CORS headers
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Content-Type": "application/json",
};

exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    await connectToDatabase();

    const [totalBooks, authorStats, genreStats, ratingStats] =
      await Promise.all([
        Book.countDocuments(),
        Book.distinct("author"),
        Book.distinct("genre"),
        Book.aggregate([
          { $group: { _id: null, avgRating: { $avg: "$rating" } } },
        ]),
      ]);

    const averageRating =
      ratingStats.length > 0
        ? Math.round(ratingStats[0].avgRating * 10) / 10
        : 0;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        totalBooks,
        totalAuthors: authorStats.length,
        totalGenres: genreStats.length,
        averageRating,
      }),
    };
  } catch (error) {
    console.error("Stats function error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Internal server error",
        details: error.message,
      }),
    };
  }
};
