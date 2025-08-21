import { Book, Plus, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  hasFilters: boolean;
  onAddBook: () => void;
  onSeedDatabase: () => void;
  onClearFilters?: () => void;
}

export default function EmptyState({
  hasFilters,
  onAddBook,
  onSeedDatabase,
  onClearFilters,
}: EmptyStateProps) {
  return (
    <Card className="border-0 shadow-elegant">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/50 mb-6">
          <Book className="h-10 w-10 text-muted-foreground" />
        </div>

        <h3 className="text-xl font-semibold text-foreground mb-2">
          {hasFilters ? "No books found" : "No books in your library"}
        </h3>

        <p className="text-muted-foreground mb-8 max-w-md">
          {hasFilters
            ? "Try adjusting your search criteria or clear filters to see all books."
            : "Get started by adding your first book or populate your library with sample data."}
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          {hasFilters && onClearFilters ? (
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="focus-ring"
            >
              Clear Filters
            </Button>
          ) : (
            <>
              <Button
                onClick={onAddBook}
                className="bg-gradient-primary hover:opacity-90 text-white border-0 focus-ring"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Book
              </Button>

              <Button
                variant="outline"
                onClick={onSeedDatabase}
                className="focus-ring"
              >
                <Database className="h-4 w-4 mr-2" />
                Load Sample Books
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
