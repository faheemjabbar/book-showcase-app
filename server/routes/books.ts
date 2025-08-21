import { RequestHandler } from "express";

// Mock database for books
interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publishedDate: string;
  genre: string;
  description: string;
  price: number;
  pages: number;
  language: string;
  inStock: boolean;
  rating: number;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

// In-memory storage (replace with real database in production)
let books: Book[] = [
  {
    id: "1",
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let nextId = 4;

// Get all books with pagination and filtering
export const getAllBooks: RequestHandler = (req, res) => {
  try {
    const { page = "1", limit = "12", search, genre } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    let filteredBooks = [...books];

    // Apply search filter
    if (search) {
      const searchTerm = (search as string).toLowerCase();
      filteredBooks = filteredBooks.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm) ||
          book.author.toLowerCase().includes(searchTerm) ||
          book.description.toLowerCase().includes(searchTerm),
      );
    }

    // Apply genre filter
    if (genre && genre !== "") {
      filteredBooks = filteredBooks.filter((book) => book.genre === genre);
    }

    // Calculate pagination
    const totalBooks = filteredBooks.length;
    const totalPages = Math.ceil(totalBooks / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;

    const paginatedBooks = filteredBooks.slice(startIndex, endIndex);

    res.json({
      books: paginatedBooks,
      totalBooks,
      totalPages,
      currentPage: pageNum,
      hasMore: pageNum < totalPages,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books" });
  }
};

// Get single book by ID
export const getBookById: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const book = books.find((b) => b.id === id);

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch book" });
  }
};

// Create new book
export const createBook: RequestHandler = (req, res) => {
  try {
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

    const newBook: Book = {
      id: nextId.toString(),
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    books.push(newBook);
    nextId++;

    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ error: "Failed to create book" });
  }
};

// Update book
export const updateBook: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const bookIndex = books.findIndex((b) => b.id === id);

    if (bookIndex === -1) {
      return res.status(404).json({ error: "Book not found" });
    }

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

    books[bookIndex] = {
      ...books[bookIndex],
      title: title || books[bookIndex].title,
      author: author || books[bookIndex].author,
      isbn: isbn || books[bookIndex].isbn,
      publishedDate: publishedDate || books[bookIndex].publishedDate,
      genre: genre || books[bookIndex].genre,
      description: description || books[bookIndex].description,
      price: price ? parseFloat(price) : books[bookIndex].price,
      pages: pages ? parseInt(pages) : books[bookIndex].pages,
      language: language || books[bookIndex].language,
      inStock:
        inStock !== undefined
          ? inStock === "true" || inStock === true
          : books[bookIndex].inStock,
      updatedAt: new Date().toISOString(),
    };

    res.json(books[bookIndex]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update book" });
  }
};

// Delete book
export const deleteBook: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const bookIndex = books.findIndex((b) => b.id === id);

    if (bookIndex === -1) {
      return res.status(404).json({ error: "Book not found" });
    }

    books.splice(bookIndex, 1);
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete book" });
  }
};

// Get stats
export const getStats: RequestHandler = (req, res) => {
  try {
    const totalBooks = books.length;
    const totalAuthors = new Set(books.map((book) => book.author)).size;
    const totalGenres = new Set(books.map((book) => book.genre)).size;
    const averageRating =
      totalBooks > 0
        ? Math.round(
            (books.reduce((sum, book) => sum + book.rating, 0) / totalBooks) *
              10,
          ) / 10
        : 0;

    res.json({
      totalBooks,
      totalAuthors,
      totalGenres,
      averageRating,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};

// Seed database with sample data
export const seedDatabase: RequestHandler = (req, res) => {
  try {
    const sampleBooks: Book[] = [
      {
        id: nextId.toString(),
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: (nextId + 1).toString(),
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: (nextId + 2).toString(),
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    // Add to existing books instead of replacing
    sampleBooks.forEach((book) => {
      if (!books.find((b) => b.isbn === book.isbn)) {
        books.push(book);
        nextId++;
      }
    });

    res.json({
      message: `Database seeded with ${sampleBooks.length} new books`,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to seed database" });
  }
};
