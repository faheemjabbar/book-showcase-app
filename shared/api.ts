/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Book management types
 */
export interface Book {
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

export interface BooksResponse {
  books: Book[];
  totalBooks: number;
  totalPages: number;
  currentPage: number;
  hasMore: boolean;
}

export interface StatsResponse {
  totalBooks: number;
  totalAuthors: number;
  totalGenres: number;
  averageRating: number;
}

export interface CreateBookRequest {
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
}
