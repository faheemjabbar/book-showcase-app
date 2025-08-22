import type { Context, Config } from "@netlify/functions";
import { Book } from "../../server/models/Book";
import { connectToDatabase } from "../../server/config/database";

// Ensure database connection before handling requests
const ensureDbConnection = async () => {
  await connectToDatabase();
};

export default async (req: Request, context: Context) => {
  const url = new URL(req.url);
  const method = req.method;
  const pathSegments = url.pathname.split("/").filter(Boolean);

  // Extract book ID if present (for /api/books/:id routes)
  const bookId = pathSegments[2]; // api/books/:id

  try {
    await ensureDbConnection();

    if (method === "GET" && !bookId) {
      // GET /api/books - Get all books with pagination and filtering
      const searchParams = url.searchParams;
      const page = parseInt(searchParams.get("page") || "1");
      const limit = parseInt(searchParams.get("limit") || "12");
      const search = searchParams.get("search");
      const genre = searchParams.get("genre");

      // Build query
      let query: any = {};

      // Apply search filter
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { author: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }

      // Apply genre filter
      if (genre && genre !== "") {
        query.genre = genre;
      }

      // Get total count for pagination
      const totalBooks = await Book.countDocuments(query);
      const totalPages = Math.ceil(totalBooks / limit);

      // Get paginated results
      const books = await Book.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      // Transform MongoDB documents to include id field
      const transformedBooks = books.map((book) => ({
        id: book._id.toString(),
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        publishedDate: book.publishedDate,
        genre: book.genre,
        description: book.description,
        price: book.price,
        pages: book.pages,
        language: book.language,
        inStock: book.inStock,
        rating: book.rating,
        coverImage: book.coverImage,
        createdAt: book.createdAt,
        updatedAt: book.updatedAt,
      }));

      return new Response(
        JSON.stringify({
          books: transformedBooks,
          totalBooks,
          totalPages,
          currentPage: page,
          hasMore: page < totalPages,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    if (method === "GET" && bookId) {
      // GET /api/books/:id - Get single book by ID
      const book = await Book.findById(bookId);

      if (!book) {
        return new Response(JSON.stringify({ error: "Book not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Transform MongoDB document to include id field
      const transformedBook = {
        id: book._id.toString(),
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        publishedDate: book.publishedDate,
        genre: book.genre,
        description: book.description,
        price: book.price,
        pages: book.pages,
        language: book.language,
        inStock: book.inStock,
        rating: book.rating,
        coverImage: book.coverImage,
        createdAt: book.createdAt,
        updatedAt: book.updatedAt,
      };

      return new Response(JSON.stringify(transformedBook), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (method === "POST" && !bookId) {
      // POST /api/books - Create new book
      const body = await req.json();
      const {
        title,
        author,
        isbn,
        publishedDate,
        genre,
        description,
        price,
        pages,
        language = "English",
        inStock = true,
      } = body;

      const newBook = new Book({
        title,
        author,
        isbn,
        publishedDate,
        genre,
        description,
        price: parseFloat(price),
        pages: parseInt(pages),
        language,
        inStock: inStock === "true" || inStock === true,
        rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // Random rating 3.0-5.0
      });

      const savedBook = await newBook.save();

      // Transform MongoDB document to include id field
      const transformedBook = {
        id: savedBook._id.toString(),
        title: savedBook.title,
        author: savedBook.author,
        isbn: savedBook.isbn,
        publishedDate: savedBook.publishedDate,
        genre: savedBook.genre,
        description: savedBook.description,
        price: savedBook.price,
        pages: savedBook.pages,
        language: savedBook.language,
        inStock: savedBook.inStock,
        rating: savedBook.rating,
        coverImage: savedBook.coverImage,
        createdAt: savedBook.createdAt,
        updatedAt: savedBook.updatedAt,
      };

      return new Response(JSON.stringify(transformedBook), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (method === "PUT" && bookId) {
      // PUT /api/books/:id - Update book
      const body = await req.json();
      const {
        title,
        author,
        isbn,
        publishedDate,
        genre,
        description,
        price,
        pages,
        language,
        inStock,
      } = body;

      const updateData: any = {};

      if (title) updateData.title = title;
      if (author) updateData.author = author;
      if (isbn) updateData.isbn = isbn;
      if (publishedDate) updateData.publishedDate = publishedDate;
      if (genre) updateData.genre = genre;
      if (description) updateData.description = description;
      if (price) updateData.price = parseFloat(price);
      if (pages) updateData.pages = parseInt(pages);
      if (language) updateData.language = language;
      if (inStock !== undefined)
        updateData.inStock = inStock === "true" || inStock === true;

      const updatedBook = await Book.findByIdAndUpdate(bookId, updateData, {
        new: true,
        runValidators: true,
      });

      if (!updatedBook) {
        return new Response(JSON.stringify({ error: "Book not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Transform MongoDB document to include id field
      const transformedBook = {
        id: updatedBook._id.toString(),
        title: updatedBook.title,
        author: updatedBook.author,
        isbn: updatedBook.isbn,
        publishedDate: updatedBook.publishedDate,
        genre: updatedBook.genre,
        description: updatedBook.description,
        price: updatedBook.price,
        pages: updatedBook.pages,
        language: updatedBook.language,
        inStock: updatedBook.inStock,
        rating: updatedBook.rating,
        coverImage: updatedBook.coverImage,
        createdAt: updatedBook.createdAt,
        updatedAt: updatedBook.updatedAt,
      };

      return new Response(JSON.stringify(transformedBook), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (method === "DELETE" && bookId) {
      // DELETE /api/books/:id - Delete book
      const deletedBook = await Book.findByIdAndDelete(bookId);

      if (!deletedBook) {
        return new Response(JSON.stringify({ error: "Book not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(
        JSON.stringify({ message: "Book deleted successfully" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in books API:", error);

    if (error.code === 11000) {
      return new Response(
        JSON.stringify({ error: "Book with this ISBN already exists" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const config: Config = {
  path: ["/api/books", "/api/books/*"],
};
