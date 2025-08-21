import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchFiltersProps {
  searchTerm: string;
  selectedGenre: string;
  onSearchChange: (value: string) => void;
  onGenreChange: (value: string) => void;
  onClearFilters: () => void;
}

const genres = [
  "Classic Literature",
  "Dystopian Fiction",
  "Romance",
  "Coming of Age",
  "Science Fiction",
  "Mystery",
  "Fantasy",
  "Thriller",
  "Horror",
  "Historical Fiction",
];

export default function SearchFilters({
  searchTerm,
  selectedGenre,
  onSearchChange,
  onGenreChange,
  onClearFilters,
}: SearchFiltersProps) {
  const hasActiveFilters = searchTerm || selectedGenre;

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-6 bg-card rounded-xl border shadow-elegant">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search books, authors, or descriptions..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 focus-ring"
        />
      </div>

      {/* Genre Filter */}
      <div className="w-full sm:w-48">
        <Select value={selectedGenre || "all"} onValueChange={onGenreChange}>
          <SelectTrigger className="focus-ring">
            <SelectValue placeholder="All Genres" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genres</SelectItem>
            {genres.map((genre) => (
              <SelectItem key={genre} value={genre}>
                {genre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={onClearFilters}
          className="w-full sm:w-auto"
        >
          Clear Filters
        </Button>
      )}
    </div>
  );
}
