import type { Context, Config } from "@netlify/functions";
import { Book } from "../../server/models/Book";
import { connectToDatabase } from "../../server/config/database";

export default async (req: Request, context: Context) => {
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    await connectToDatabase();

    const totalBooks = await Book.countDocuments();
    const totalAuthors = await Book.distinct("author").then(
      (authors) => authors.length,
    );
    const totalGenres = await Book.distinct("genre").then(
      (genres) => genres.length,
    );

    const avgRatingResult = await Book.aggregate([
      { $group: { _id: null, averageRating: { $avg: "$rating" } } },
    ]);

    const averageRating =
      avgRatingResult.length > 0
        ? Math.round(avgRatingResult[0].averageRating * 10) / 10
        : 0;

    return new Response(
      JSON.stringify({
        totalBooks,
        totalAuthors,
        totalGenres,
        averageRating,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error fetching stats:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch stats" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const config: Config = {
  path: "/api/stats",
};
