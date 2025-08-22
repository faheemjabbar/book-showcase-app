import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import Header from "@/components/Header";
import StatsGrid from "@/components/StatsGrid";
import SearchFilters from "@/components/SearchFilters";
import BookCard from "@/components/BookCard";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";
import AddBookModal from "@/components/AddBookModal";
import BookDetailModal from "@/components/BookDetailModal";
import EditBookModal from "@/components/EditBookModal";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import type { Book, BooksResponse, StatsResponse } from "@shared/api";

// API functions
const api = {
  books: {
    getAll: async (
      params: Record<string, string> = {},
    ): Promise<BooksResponse> => {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`/api/books?${queryString}`);
      if (!response.ok) throw new Error("Failed to fetch books");
      return response.json();
    },
    getOne: async (id: string): Promise<Book> => {
      const response = await fetch(`/api/books/${id}`);
      if (!response.ok) throw new Error("Failed to fetch book");
      return response.json();
    },
    create: async (formData: FormData): Promise<Book> => {
      const response = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to create book");
      return response.json();
    },
    update: async (id: string, formData: FormData): Promise<Book> => {
      const response = await fetch(`/api/books/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to update book");
      return response.json();
    },
    delete: async (id: string): Promise<{ message: string }> => {
      const response = await fetch(`/api/books/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete book");
      return response.json();
    },
  },
  stats: {
    get: async (): Promise<StatsResponse> => {
      const response = await fetch("/api/stats");
      if (!response.ok) throw new Error("Failed to fetch stats");
      return response.json();
    },
  },
  seed: async (): Promise<{ message: string }> => {
    const response = await fetch("/api/seed", {
      method: "POST",
    });
    if (!response.ok) throw new Error("Failed to seed database");
    return response.json();
  },
};

export default function Index() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const { toast } = useToast();

  // Query for books
  const {
    data: booksResponse,
    isLoading: booksLoading,
    error: booksError,
    refetch: refetchBooks,
  } = useQuery({
    queryKey: ["books", currentPage, searchTerm, selectedGenre],
    queryFn: () => {
      const params: Record<string, string> = {
        page: currentPage.toString(),
        limit: "12",
      };
      if (searchTerm) params.search = searchTerm;
      if (selectedGenre) params.genre = selectedGenre;
      return api.books.getAll(params);
    },
    retry: 1,
    onSuccess: () => setIsConnected(true),
    onError: () => setIsConnected(false),
  });

  // Query for stats
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ["stats"],
    queryFn: api.stats.get,
    retry: 1,
    onSuccess: () => setIsConnected(true),
    onError: () => setIsConnected(false),
  });

  // Check connection status
  useEffect(() => {
    if (booksError || statsError) {
      setIsConnected(false);
    } else if (booksResponse || stats) {
      setIsConnected(true);
    }
  }, [booksError, statsError, booksResponse, stats]);

  // Handlers
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleGenreChange = (value: string) => {
    setSelectedGenre(value === "all" ? "" : value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedGenre("");
    setCurrentPage(1);
  };

  const handleSeedDatabase = async () => {
    try {
      await api.seed();
      toast({
        title: "Success!",
        description: "Database seeded with sample books.",
      });
      refetchBooks();
      refetchStats();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to seed database. Please check your connection.",
        variant: "destructive",
      });
    }
  };

  const handleAddBook = () => {
    setIsAddModalOpen(true);
  };

  const handleViewBook = async (book: Book) => {
    setSelectedBook(book);
    setIsDetailModalOpen(true);
  };

  const handleEditBook = (book: Book) => {
    setSelectedBook(book);
    setIsEditModalOpen(true);
  };

  const handleDeleteBook = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      await api.books.delete(id);
      toast({
        title: "Success!",
        description: "Book deleted successfully.",
      });
      refetchBooks();
      refetchStats();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete book. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRetryConnection = () => {
    refetchBooks();
    refetchStats();
  };

  // Loading state
  if (booksLoading && statsLoading && isConnected === null) {
    return (
      <div className="min-h-screen bg-background">
        <Header isConnected={isConnected} />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingState />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        onAddBook={handleAddBook}
        onSeedDatabase={handleSeedDatabase}
        isConnected={isConnected}
      />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Connection Error */}
        {isConnected === false && (
          <Alert className="border-destructive/50 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <div>
                <strong>Backend Server Not Running</strong>
                <p className="mt-1 text-sm">
                  The API server is not responding. Make sure your Express
                  server is running.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetryConnection}
                className="ml-4"
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Section */}
        {isConnected && stats && (
          <section className="animate-fade-in">
            <StatsGrid stats={stats} />
          </section>
        )}

        {/* Search and Filters */}
        {isConnected && (
          <section className="animate-fade-in">
            <SearchFilters
              searchTerm={searchTerm}
              selectedGenre={selectedGenre}
              onSearchChange={handleSearchChange}
              onGenreChange={handleGenreChange}
              onClearFilters={handleClearFilters}
            />
          </section>
        )}

        {/* Books Section */}
        {isConnected && (
          <section className="animate-fade-in">
            {booksLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i} className="border-0 shadow-elegant">
                    <CardContent className="p-0">
                      <div className="aspect-[3/4] w-full bg-muted animate-pulse rounded-t-xl" />
                      <div className="p-4 space-y-3">
                        <div className="h-5 w-3/4 bg-muted animate-pulse rounded" />
                        <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
                        <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                        <div className="h-3 w-full bg-muted animate-pulse rounded" />
                        <div className="flex justify-between">
                          <div className="h-5 w-16 bg-muted animate-pulse rounded" />
                          <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : booksResponse && booksResponse.books.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {booksResponse.books.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      onView={handleViewBook}
                      onEdit={handleEditBook}
                      onDelete={handleDeleteBook}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {booksResponse.totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-4 mt-8">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {currentPage} of {booksResponse.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentPage((p) =>
                          Math.min(p + 1, booksResponse.totalPages),
                        )
                      }
                      disabled={currentPage === booksResponse.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <EmptyState
                hasFilters={Boolean(searchTerm || selectedGenre)}
                onAddBook={handleAddBook}
                onSeedDatabase={handleSeedDatabase}
                onClearFilters={
                  searchTerm || selectedGenre ? handleClearFilters : undefined
                }
              />
            )}
          </section>
        )}
      </main>
    </div>
  );
}
