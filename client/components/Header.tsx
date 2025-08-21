import { Moon, Sun, Book, Plus, Database } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onAddBook?: () => void;
  onSeedDatabase?: () => void;
  isConnected?: boolean;
}

export default function Header({
  onAddBook,
  onSeedDatabase,
  isConnected,
}: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-elegant">
              <Book className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">BookVault</h1>
              <p className="text-xs text-muted-foreground">
                Professional Library Management
              </p>
            </div>
          </div>

          {/* Connection Status */}
          {isConnected !== undefined && (
            <div className="hidden sm:flex items-center space-x-2">
              <div
                className={cn(
                  "flex items-center space-x-2 rounded-full px-3 py-1 text-xs font-medium",
                  isConnected
                    ? "bg-success/10 text-success border border-success/20"
                    : "bg-destructive/10 text-destructive border border-destructive/20",
                )}
              >
                <div
                  className={cn(
                    "h-2 w-2 rounded-full",
                    isConnected ? "bg-success" : "bg-destructive",
                  )}
                />
                {isConnected ? "Connected" : "Disconnected"}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {isConnected && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onSeedDatabase}
                  className="hidden sm:flex"
                >
                  <Database className="h-4 w-4 mr-2" />
                  Seed Data
                </Button>
                <Button
                  size="sm"
                  onClick={onAddBook}
                  className="bg-gradient-primary hover:opacity-90 text-white border-0"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Book
                </Button>
              </>
            )}

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="h-9 w-9 p-0"
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
