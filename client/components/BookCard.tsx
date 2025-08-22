import { Star, Eye, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import BookCover from "@/components/BookCover";
import type { Book as BookType } from "@shared/api";

interface BookCardProps {
  book: BookType;
  onView: (book: BookType) => void;
  onEdit: (book: BookType) => void;
  onDelete: (id: string) => void;
}

export default function BookCard({
  book,
  onView,
  onEdit,
  onDelete,
}: BookCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "h-3 w-3",
          i < Math.floor(rating)
            ? "text-amber-400 fill-amber-400"
            : "text-gray-300 dark:text-gray-600",
        )}
      />
    ));
  };

  return (
    <Card className="group h-full border-0 shadow-elegant hover:shadow-elegant-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-surface">
      <CardContent className="p-0">
        {/* Book Cover */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-xl">
          {book.coverImage ? (
            <img
              src={book.coverImage}
              alt={book.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <BookCover
              book={book}
              className="transition-transform duration-300 group-hover:scale-105"
            />
          )}

          {/* Stock Badge */}
          <Badge
            variant={book.inStock ? "default" : "destructive"}
            className={cn(
              "absolute top-3 right-3 text-xs z-10",
              book.inStock
                ? "bg-success text-success-foreground"
                : "bg-destructive text-destructive-foreground",
            )}
          >
            {book.inStock ? "In Stock" : "Out of Stock"}
          </Badge>
        </div>

        {/* Book Details */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {book.title}
            </h3>
            <p className="text-sm text-muted-foreground">by {book.author}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {renderStars(book.rating)}
            </div>
            <span className="text-sm text-muted-foreground">
              ({book.rating})
            </span>
          </div>

          {/* Genre */}
          <Badge variant="secondary" className="text-xs">
            {book.genre}
          </Badge>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-3">
            {book.description}
          </p>

          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-primary">
              ${book.price}
            </span>
            <span className="text-sm text-muted-foreground">
              {book.pages} pages
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 p-4 pt-0">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onView(book)}
          className="flex-1 focus-ring"
        >
          <Eye className="h-4 w-4 mr-2" />
          View
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(book)}
          className="focus-ring"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(book.id)}
          className="text-destructive hover:text-destructive hover:bg-destructive/10 focus-ring"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
