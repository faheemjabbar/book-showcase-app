import {
  Star,
  Book as BookIcon,
  Calendar,
  Globe,
  DollarSign,
  FileText,
  User,
  Hash,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import BookCover from "@/components/BookCover";
import type { Book } from "@shared/api";

interface BookDetailModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
}

export default function BookDetailModal({
  book,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: BookDetailModalProps) {
  if (!book) return null;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "h-4 w-4",
          i < Math.floor(rating)
            ? "text-amber-400 fill-amber-400"
            : "text-gray-300 dark:text-gray-600",
        )}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
      onDelete(book.id);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Book Details</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Book Cover */}
          <div className="md:col-span-1">
            <div className="aspect-[3/4] w-full max-w-sm mx-auto">
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-full object-cover rounded-lg shadow-elegant"
                />
              ) : (
                <BookCover book={book} className="shadow-elegant rounded-lg" />
              )}
            </div>

            {/* Stock Status */}
            <div className="mt-4 text-center">
              <Badge
                variant={book.inStock ? "default" : "destructive"}
                className={cn(
                  "text-sm px-4 py-2",
                  book.inStock
                    ? "bg-success text-success-foreground"
                    : "bg-destructive text-destructive-foreground",
                )}
              >
                {book.inStock ? "✓ In Stock" : "✗ Out of Stock"}
              </Badge>
            </div>
          </div>

          {/* Book Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Title and Author */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                {book.title}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground mb-3">
                <User className="h-4 w-4" />
                <span className="text-lg">by {book.author}</span>
              </div>

              {/* Genre Badge */}
              <Badge variant="secondary" className="text-sm">
                {book.genre}
              </Badge>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {renderStars(book.rating)}
              </div>
              <span className="text-lg font-medium">{book.rating}/5</span>
              <span className="text-muted-foreground">rating</span>
            </div>

            <Separator />

            {/* Book Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">ISBN</p>
                  <p className="font-medium">{book.isbn}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Published</p>
                  <p className="font-medium">
                    {formatDate(book.publishedDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Language</p>
                  <p className="font-medium">{book.language}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Pages</p>
                  <p className="font-medium">{book.pages}</p>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <DollarSign className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="text-2xl font-bold text-primary">${book.price}</p>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <BookIcon className="h-5 w-5" />
                Description
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {book.description}
              </p>
            </div>

            <Separator />

            {/* Metadata */}
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Added: {formatDate(book.createdAt)}</p>
              <p>Last updated: {formatDate(book.updatedAt)}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button onClick={() => onEdit(book)} className="flex-1">
                Edit Book
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="flex-1"
              >
                Delete Book
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
