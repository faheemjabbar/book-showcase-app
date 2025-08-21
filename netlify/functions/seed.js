const { connectToDatabase } = require('./utils/mongodb');
const Book = require('./models/Book');

// CORS headers
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

const sampleBooks = [
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '978-0-7432-7356-5',
    publishedDate: new Date('1925-04-10'),
    genre: 'Classic Literature',
    description: 'A classic American novel about the Jazz Age and the American Dream.',
    price: 12.99,
    pages: 180,
    language: 'English',
    inStock: true,
    rating: 4.2,
  },
  {
    title: '1984',
    author: 'George Orwell',
    isbn: '978-0-452-28423-4',
    publishedDate: new Date('1949-06-08'),
    genre: 'Dystopian Fiction',
    description: 'A dystopian social science fiction novel about totalitarian control.',
    price: 13.99,
    pages: 328,
    language: 'English',
    inStock: true,
    rating: 4.7,
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    isbn: '978-0-14-143951-8',
    publishedDate: new Date('1813-01-28'),
    genre: 'Romance',
    description: 'A romantic novel of manners written by Jane Austen.',
    price: 11.99,
    pages: 432,
    language: 'English',
    inStock: false,
    rating: 4.5,
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '978-0-06-112008-4',
    publishedDate: new Date('1960-07-11'),
    genre: 'Classic Literature',
    description: 'A gripping tale of racial injustice and childhood innocence.',
    price: 14.99,
    pages: 376,
    language: 'English',
    inStock: true,
    rating: 4.8,
  },
  {
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    isbn: '978-0-316-76948-0',
    publishedDate: new Date('1951-07-16'),
    genre: 'Coming of Age',
    description: 'A controversial novel about teenage rebellion and angst.',
    price: 13.49,
    pages: 234,
    language: 'English',
    inStock: true,
    rating: 3.8,
  },
  {
    title: 'Dune',
    author: 'Frank Herbert',
    isbn: '978-0-441-17271-9',
    publishedDate: new Date('1965-08-01'),
    genre: 'Science Fiction',
    description: 'An epic science fiction novel set on the desert planet Arrakis.',
    price: 16.99,
    pages: 688,
    language: 'English',
    inStock: false,
    rating: 4.6,
  }
];

exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    await connectToDatabase();

    // Check which books already exist
    const existingBooks = await Book.find({
      isbn: { $in: sampleBooks.map(book => book.isbn) }
    });

    const existingIsbns = new Set(existingBooks.map(book => book.isbn));
    
    // Filter out books that already exist
    const newBooks = sampleBooks.filter(book => !existingIsbns.has(book.isbn));

    if (newBooks.length === 0) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          message: 'All sample books already exist in database',
          booksAdded: 0
        })
      };
    }

    // Insert new books
    const insertedBooks = await Book.insertMany(newBooks);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        message: `Database seeded with ${insertedBooks.length} new books`,
        booksAdded: insertedBooks.length
      })
    };
  } catch (error) {
    console.error('Seed function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      })
    };
  }
};
