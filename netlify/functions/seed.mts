import type { Context, Config } from "@netlify/functions";
import { Book } from "../../server/models/Book";
import { connectToDatabase } from "../../server/config/database";

export default async (req: Request, context: Context) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    await connectToDatabase();

    const sampleBooks = [
      {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        isbn: "978-0-7432-7356-5",
        publishedDate: "1925-04-10",
        genre: "Classic Literature",
        description:
          "A classic American novel about the Jazz Age and the American Dream.",
        price: 12.99,
        pages: 180,
        language: "English",
        inStock: true,
        rating: 4.2,
        coverImage:
          "https://books.google.com/books/content?id=iUqOtgAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
      },
      {
        title: "1984",
        author: "George Orwell",
        isbn: "978-0-452-28423-4",
        publishedDate: "1949-06-08",
        genre: "Dystopian Fiction",
        description:
          "A dystopian social science fiction novel about totalitarian control.",
        price: 13.99,
        pages: 328,
        language: "English",
        inStock: true,
        rating: 4.7,
        coverImage:
          "https://books.google.com/books/content?id=kotPYEqx7kMC&printsec=frontcover&img=1&zoom=1&source=gbs_api",
      },
      {
        title: "Pride and Prejudice",
        author: "Jane Austen",
        isbn: "978-0-14-143951-8",
        publishedDate: "1813-01-28",
        genre: "Romance",
        description: "A romantic novel of manners written by Jane Austen.",
        price: 11.99,
        pages: 432,
        language: "English",
        inStock: false,
        rating: 4.5,
        coverImage:
          "https://books.google.com/books/content?id=ZwQ_DwAAQBAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
      },
      {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        isbn: "978-0-06-112008-4",
        publishedDate: "1960-07-11",
        genre: "Classic Literature",
        description:
          "A gripping tale of racial injustice and childhood innocence.",
        price: 14.99,
        pages: 376,
        language: "English",
        inStock: true,
        rating: 4.8,
        coverImage:
          "https://books.google.com/books/content?id=PGR2AwAAQBAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
      },
      {
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        isbn: "978-0-316-76948-0",
        publishedDate: "1951-07-16",
        genre: "Coming of Age",
        description: "A controversial novel about teenage rebellion and angst.",
        price: 13.49,
        pages: 234,
        language: "English",
        inStock: true,
        rating: 3.8,
        coverImage:
          "https://books.google.com/books/content?id=PCDengEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
      },
      {
        title: "Dune",
        author: "Frank Herbert",
        isbn: "978-0-441-17271-9",
        publishedDate: "1965-08-01",
        genre: "Science Fiction",
        description:
          "An epic science fiction novel set on the desert planet Arrakis.",
        price: 16.99,
        pages: 688,
        language: "English",
        inStock: false,
        rating: 4.6,
        coverImage:
          "https://books.google.com/books/content?id=B1hSG45JCX4C&printsec=frontcover&img=1&zoom=1&source=gbs_api",
      },
    ];

    let addedCount = 0;
    for (const bookData of sampleBooks) {
      try {
        // Check if book with this ISBN already exists
        const existingBook = await Book.findOne({ isbn: bookData.isbn });
        if (!existingBook) {
          await Book.create(bookData);
          addedCount++;
        }
      } catch (error) {
        console.log(`Skipping duplicate book: ${bookData.title}`);
      }
    }

    return new Response(
      JSON.stringify({
        message: `Database seeded with ${addedCount} new books`,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error seeding database:", error);
    return new Response(JSON.stringify({ error: "Failed to seed database" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const config: Config = {
  path: "/api/seed",
};
