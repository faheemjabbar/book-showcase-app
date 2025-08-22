import { useState } from "react";
import { Search, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { googleBooksService } from "@/lib/googleBooks";
import type { CreateBookRequest } from "@shared/api";

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const genres = [
  "Classic Literature",
  "Science Fiction",
  "Fantasy",
  "Romance",
  "Mystery",
  "Thriller",
  "Horror",
  "Non-Fiction",
  "Biography",
  "History",
  "Business",
  "Self-Help",
  "Children's Books",
  "Young Adult",
  "Coming of Age",
  "Dystopian Fiction",
  "Adventure",
  "Contemporary Fiction",
  "Historical Fiction",
  "Literary Fiction"
];

export default function AddBookModal({ isOpen, onClose, onSuccess }: AddBookModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<CreateBookRequest>({
    title: "",
    author: "",
    isbn: "",
    publishedDate: "",
    genre: "",
    description: "",
    price: 0,
    pages: 0,
    language: "English",
    inStock: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create book");
      }

      toast({
        title: "Success!",
        description: "Book added successfully.",
      });

      onSuccess();
      onClose();
      
      // Reset form
      setFormData({
        title: "",
        author: "",
        isbn: "",
        publishedDate: "",
        genre: "",
        description: "",
        price: 0,
        pages: 0,
        language: "English",
        inStock: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add book. Please check your input and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof CreateBookRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearchBooks = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search Query Required",
        description: "Please enter a book title, author, or ISBN to search.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    try {
      const enrichedData = await googleBooksService.enrichBookData(searchQuery);

      if (enrichedData) {
        setFormData(prev => ({
          ...prev,
          ...enrichedData,
          price: prev.price || 0, // Keep user's price if set
        }));

        toast({
          title: "Book Found!",
          description: `Successfully found "${enrichedData.title}" by ${enrichedData.author}`,
        });
      } else {
        toast({
          title: "No Results",
          description: "No books found for your search query. You can still add the book manually.",
        });
      }
    } catch (error) {
      toast({
        title: "Search Error",
        description: "Failed to search for books. You can still add the book manually.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Book</DialogTitle>
          <DialogDescription>
            Search for a book to auto-fill details, or fill in manually.
          </DialogDescription>
        </DialogHeader>

        {/* Book Search */}
        <div className="space-y-3 border-b pb-4">
          <Label htmlFor="search">Search Books (Google Books API)</Label>
          <div className="flex gap-2">
            <Input
              id="search"
              placeholder="Enter book title, author, or ISBN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchBooks()}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleSearchBooks}
              disabled={isSearching}
              className="min-w-[100px]"
            >
              {isSearching ? (
                <BookOpen className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => handleChange("author", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="isbn">ISBN *</Label>
              <Input
                id="isbn"
                value={formData.isbn}
                onChange={(e) => handleChange("isbn", e.target.value)}
                placeholder="978-0-123456-78-9"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="publishedDate">Published Date *</Label>
              <Input
                id="publishedDate"
                type="date"
                value={formData.publishedDate}
                onChange={(e) => handleChange("publishedDate", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="genre">Genre *</Label>
              <Select value={formData.genre} onValueChange={(value) => handleChange("genre", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a genre" />
                </SelectTrigger>
                <SelectContent>
                  {genres.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Input
                id="language"
                value={formData.language}
                onChange={(e) => handleChange("language", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price ($) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleChange("price", parseFloat(e.target.value) || 0)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pages">Pages *</Label>
              <Input
                id="pages"
                type="number"
                min="1"
                value={formData.pages}
                onChange={(e) => handleChange("pages", parseInt(e.target.value) || 0)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="inStock"
              checked={formData.inStock}
              onCheckedChange={(checked) => handleChange("inStock", checked)}
            />
            <Label htmlFor="inStock">In Stock</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Book"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
