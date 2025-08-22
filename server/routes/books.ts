import { RequestHandler } from "express";
import { Book, IBook } from "../models/Book";
import { connectToDatabase } from "../config/database";

// Ensure database connection before handling requests
const ensureDbConnection = async () => {
  await connectToDatabase();
};

// Get all books with pagination and filtering
export const getAllBooks: RequestHandler = async (req, res) => {
  try {
    await ensureDbConnection();

    const { page = "1", limit = "12", search, genre } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    // Build query
    let query: any = {};

    // Apply search filter
    if (search) {
      const searchTerm = search as string;
      query.$or = [
        { title: { $regex: searchTerm, $options: "i" } },
        { author: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
      ];
    }

    // Apply genre filter
    if (genre && genre !== "") {
      query.genre = genre;
    }

    // Get total count for pagination
    const totalBooks = await Book.countDocuments(query);
    const totalPages = Math.ceil(totalBooks / limitNum);

    // Get paginated results
    const books = await Book.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

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

    res.json({
      books: transformedBooks,
      totalBooks,
      totalPages,
      currentPage: pageNum,
      hasMore: pageNum < totalPages,
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Failed to fetch books" });
  }
};

// Get single book by ID
export const getBookById: RequestHandler = async (req, res) => {
  try {
    await ensureDbConnection();

    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
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

    res.json(transformedBook);
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({ error: "Failed to fetch book" });
  }
};

// Create new book
export const createBook: RequestHandler = async (req, res) => {
  try {
    await ensureDbConnection();

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
    } = req.body;

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

    res.status(201).json(transformedBook);
  } catch (error) {
    console.error("Error creating book:", error);
    if (error.code === 11000) {
      res.status(400).json({ error: "Book with this ISBN already exists" });
    } else {
      res.status(500).json({ error: "Failed to create book" });
    }
  }
};

// Update book
export const updateBook: RequestHandler = async (req, res) => {
  try {
    await ensureDbConnection();

    const { id } = req.params;
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
    } = req.body;

    const updateData: Partial<IBook> = {};

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

    const updatedBook = await Book.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedBook) {
      return res.status(404).json({ error: "Book not found" });
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

    res.json(transformedBook);
  } catch (error) {
    console.error("Error updating book:", error);
    if (error.code === 11000) {
      res.status(400).json({ error: "Book with this ISBN already exists" });
    } else {
      res.status(500).json({ error: "Failed to update book" });
    }
  }
};

// Delete book
export const deleteBook: RequestHandler = async (req, res) => {
  try {
    await ensureDbConnection();

    const { id } = req.params;
    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ error: "Failed to delete book" });
  }
};

// Get stats
export const getStats: RequestHandler = async (req, res) => {
  try {
    await ensureDbConnection();

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

    res.json({
      totalBooks,
      totalAuthors,
      totalGenres,
      averageRating,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};

// Seed database with sample data
export const seedDatabase: RequestHandler = async (req, res) => {
  try {
    await ensureDbConnection();

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

    res.json({
      message: `Database seeded with ${addedCount} new books`,
    });
  } catch (error) {
    console.error("Error seeding database:", error);
    res.status(500).json({ error: "Failed to seed database" });
  }
};
