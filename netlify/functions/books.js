const { connectToDatabase } = require("./utils/mongodb");
const Book = require("./models/Book");

// CORS headers
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
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

  try {
    await connectToDatabase();

    const { httpMethod, path, queryStringParameters, body } = event;
    const pathParts = path.split("/").filter(Boolean);
    const bookId = pathParts[pathParts.length - 1];

    switch (httpMethod) {
      case "GET":
        // Check if getting single book
        if (bookId && bookId !== "books" && pathParts.includes("books")) {
          try {
            const book = await Book.findById(bookId);
            if (!book) {
              return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: "Book not found" }),
              };
            }
            return {
              statusCode: 200,
              headers,
              body: JSON.stringify(book),
            };
          } catch (error) {
            return {
              statusCode: 400,
              headers,
              body: JSON.stringify({ error: "Invalid book ID" }),
            };
          }
        }

        // Get all books with filtering and pagination
        const {
          page = "1",
          limit = "12",
          search,
          genre,
        } = queryStringParameters || {};

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Build query
        let query = {};

        if (search) {
          query.$text = { $search: search };
        }

        if (genre && genre !== "") {
          query.genre = genre;
        }

        // Execute query
        const [books, totalBooks] = await Promise.all([
          Book.find(query)
            .sort(
              search ? { score: { $meta: "textScore" } } : { createdAt: -1 },
            )
            .skip(skip)
            .limit(limitNum),
          Book.countDocuments(query),
        ]);

        const totalPages = Math.ceil(totalBooks / limitNum);

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            books,
            totalBooks,
            totalPages,
            currentPage: pageNum,
            hasMore: pageNum < totalPages,
          }),
        };

      case "POST":
        const bookData = JSON.parse(body);

        // Generate random rating if not provided
        if (!bookData.rating) {
          bookData.rating = Math.round((Math.random() * 2 + 3) * 10) / 10;
        }

        const newBook = new Book(bookData);
        await newBook.save();

        return {
          statusCode: 201,
          headers,
          body: JSON.stringify(newBook),
        };

      case "PUT":
        if (!bookId) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: "Book ID required" }),
          };
        }

        const updateData = JSON.parse(body);
        const updatedBook = await Book.findByIdAndUpdate(bookId, updateData, {
          new: true,
          runValidators: true,
        });

        if (!updatedBook) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: "Book not found" }),
          };
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(updatedBook),
        };

      case "DELETE":
        if (!bookId) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: "Book ID required" }),
          };
        }

        const deletedBook = await Book.findByIdAndDelete(bookId);

        if (!deletedBook) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: "Book not found" }),
          };
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: "Book deleted successfully" }),
        };

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: "Method not allowed" }),
        };
    }
  } catch (error) {
    console.error("Function error:", error);
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
