export interface GoogleBookInfo {
  title: string;
  authors: string[];
  publishedDate: string;
  description: string;
  categories: string[];
  pageCount: number;
  language: string;
  imageLinks?: {
    thumbnail?: string;
    smallThumbnail?: string;
  };
  industryIdentifiers: Array<{
    type: string;
    identifier: string;
  }>;
}

export interface GoogleBookItem {
  id: string;
  volumeInfo: GoogleBookInfo;
}

export interface GoogleBooksResponse {
  items: GoogleBookItem[];
  totalItems: number;
}

class GoogleBooksService {
  private baseUrl = "https://www.googleapis.com/books/v1/volumes";

  async searchBooks(query: string, maxResults = 10): Promise<GoogleBooksResponse> {
    try {
      const url = `${this.baseUrl}?q=${encodeURIComponent(query)}&maxResults=${maxResults}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error("Failed to fetch books from Google Books API");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Google Books API error:", error);
      throw error;
    }
  }

  async searchByISBN(isbn: string): Promise<GoogleBookItem | null> {
    try {
      const cleanISBN = isbn.replace(/[-\s]/g, "");
      const response = await this.searchBooks(`isbn:${cleanISBN}`, 1);
      
      return response.items?.[0] || null;
    } catch (error) {
      console.error("ISBN search error:", error);
      return null;
    }
  }

  async searchByTitle(title: string, author?: string): Promise<GoogleBookItem[]> {
    try {
      let query = `intitle:${title}`;
      if (author) {
        query += `+inauthor:${author}`;
      }
      
      const response = await this.searchBooks(query, 5);
      return response.items || [];
    } catch (error) {
      console.error("Title search error:", error);
      return [];
    }
  }

  convertToBookData(googleBook: GoogleBookItem) {
    const { volumeInfo } = googleBook;
    
    // Get ISBN (prefer ISBN-13, fallback to ISBN-10)
    const isbn13 = volumeInfo.industryIdentifiers?.find(id => id.type === "ISBN_13")?.identifier;
    const isbn10 = volumeInfo.industryIdentifiers?.find(id => id.type === "ISBN_10")?.identifier;
    const isbn = isbn13 || isbn10 || "";

    // Format date (Google Books sometimes returns year only)
    let publishedDate = volumeInfo.publishedDate || "";
    if (publishedDate && publishedDate.length === 4) {
      publishedDate = `${publishedDate}-01-01`;
    }

    return {
      title: volumeInfo.title || "",
      author: volumeInfo.authors?.[0] || "",
      isbn: isbn,
      publishedDate: publishedDate,
      genre: volumeInfo.categories?.[0] || "Fiction",
      description: volumeInfo.description || "",
      pages: volumeInfo.pageCount || 0,
      language: volumeInfo.language === "en" ? "English" : volumeInfo.language || "English",
      coverImage: volumeInfo.imageLinks?.thumbnail?.replace("http://", "https://") || "",
      price: 0, // Google Books API doesn't provide pricing
      inStock: true,
    };
  }

  async enrichBookData(title: string, author?: string, isbn?: string) {
    try {
      let googleBook: GoogleBookItem | null = null;

      // Try ISBN first if available
      if (isbn) {
        googleBook = await this.searchByISBN(isbn);
      }

      // If no result from ISBN, try title + author
      if (!googleBook && title) {
        const results = await this.searchByTitle(title, author);
        googleBook = results[0] || null;
      }

      if (googleBook) {
        return this.convertToBookData(googleBook);
      }

      return null;
    } catch (error) {
      console.error("Error enriching book data:", error);
      return null;
    }
  }
}

export const googleBooksService = new GoogleBooksService();
