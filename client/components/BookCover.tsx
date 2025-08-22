import { useMemo } from "react";
import type { Book } from "@shared/api";

interface BookCoverProps {
  book: Pick<Book, "title" | "author" | "genre">;
  className?: string;
}

export default function BookCover({ book, className = "" }: BookCoverProps) {
  // Generate a consistent color scheme based on genre
  const colorScheme = useMemo(() => {
    const schemes = {
      "Classic Literature": {
        primary: "#8B4513",
        secondary: "#D2691E",
        accent: "#F4E4BC",
        text: "#FFFFFF",
      },
      "Dystopian Fiction": {
        primary: "#2C3E50",
        secondary: "#34495E",
        accent: "#E74C3C",
        text: "#FFFFFF",
      },
      Romance: {
        primary: "#8E44AD",
        secondary: "#C39BD3",
        accent: "#F8C471",
        text: "#FFFFFF",
      },
      "Coming of Age": {
        primary: "#E67E22",
        secondary: "#F39C12",
        accent: "#F7DC6F",
        text: "#FFFFFF",
      },
      "Science Fiction": {
        primary: "#1B4F72",
        secondary: "#2874A6",
        accent: "#5DADE2",
        text: "#FFFFFF",
      },
      Fantasy: {
        primary: "#4A148C",
        secondary: "#7B1FA2",
        accent: "#BA68C8",
        text: "#FFFFFF",
      },
      Mystery: {
        primary: "#212121",
        secondary: "#424242",
        accent: "#FF5722",
        text: "#FFFFFF",
      },
      Thriller: {
        primary: "#B71C1C",
        secondary: "#D32F2F",
        accent: "#FFCDD2",
        text: "#FFFFFF",
      },
      Horror: {
        primary: "#1A1A1A",
        secondary: "#333333",
        accent: "#FF1744",
        text: "#FFFFFF",
      },
      "Non-Fiction": {
        primary: "#37474F",
        secondary: "#546E7A",
        accent: "#90A4AE",
        text: "#FFFFFF",
      },
      default: {
        primary: "#6366F1",
        secondary: "#8B5CF6",
        accent: "#A855F7",
        text: "#FFFFFF",
      },
    };

    return schemes[book.genre as keyof typeof schemes] || schemes.default;
  }, [book.genre]);

  // Generate a unique pattern based on book title
  const patternId = useMemo(() => {
    return `pattern-${book.title.replace(/\s+/g, "-").toLowerCase()}`;
  }, [book.title]);

  // Truncate long titles for better display
  const displayTitle =
    book.title.length > 40 ? book.title.substring(0, 37) + "..." : book.title;
  const displayAuthor =
    book.author.length > 30
      ? book.author.substring(0, 27) + "..."
      : book.author;

  return (
    <div className={`relative w-full h-full ${className}`}>
      <svg
        viewBox="0 0 300 400"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradient background */}
          <linearGradient
            id={`gradient-${patternId}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor={colorScheme.primary} />
            <stop offset="100%" stopColor={colorScheme.secondary} />
          </linearGradient>

          {/* Subtle pattern overlay */}
          <pattern
            id={patternId}
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx="10"
              cy="10"
              r="1"
              fill={colorScheme.accent}
              opacity="0.1"
            />
          </pattern>
        </defs>

        {/* Background */}
        <rect
          width="300"
          height="400"
          fill={`url(#gradient-${patternId})`}
          rx="8"
          ry="8"
        />

        {/* Pattern overlay */}
        <rect
          width="300"
          height="400"
          fill={`url(#${patternId})`}
          rx="8"
          ry="8"
        />

        {/* Border */}
        <rect
          x="10"
          y="10"
          width="280"
          height="380"
          fill="none"
          stroke={colorScheme.accent}
          strokeWidth="2"
          rx="4"
          ry="4"
          opacity="0.6"
        />

        {/* Genre badge */}
        <rect
          x="20"
          y="20"
          width="260"
          height="25"
          fill={colorScheme.accent}
          rx="12"
          ry="12"
          opacity="0.9"
        />
        <text
          x="150"
          y="37"
          textAnchor="middle"
          fontSize="12"
          fontWeight="600"
          fill={colorScheme.primary}
          fontFamily="Inter, system-ui, sans-serif"
        >
          {book.genre.toUpperCase()}
        </text>

        {/* Title */}
        <foreignObject x="20" y="70" width="260" height="200">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              textAlign: "center",
              padding: "10px",
            }}
          >
            <h1
              style={{
                fontSize: displayTitle.length > 20 ? "20px" : "24px",
                fontWeight: "bold",
                color: colorScheme.text,
                fontFamily: "Inter, system-ui, sans-serif",
                lineHeight: "1.2",
                margin: "0",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              {displayTitle}
            </h1>
          </div>
        </foreignObject>

        {/* Author */}
        <text
          x="150"
          y="320"
          textAnchor="middle"
          fontSize="16"
          fontWeight="500"
          fill={colorScheme.text}
          fontFamily="Inter, system-ui, sans-serif"
          opacity="0.9"
        >
          {displayAuthor}
        </text>

        {/* Decorative elements */}
        <line
          x1="60"
          y1="340"
          x2="240"
          y2="340"
          stroke={colorScheme.accent}
          strokeWidth="2"
          opacity="0.6"
        />

        {/* Bottom accent */}
        <rect
          x="20"
          y="360"
          width="260"
          height="20"
          fill={colorScheme.accent}
          rx="10"
          ry="10"
          opacity="0.3"
        />
      </svg>
    </div>
  );
}
