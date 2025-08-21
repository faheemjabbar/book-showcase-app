import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getStats,
  seedDatabase,
} from "./routes/books";
import { connectToDatabase } from "./config/database";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Book management routes
  app.get("/api/books", getAllBooks);
  app.get("/api/books/:id", getBookById);
  app.post("/api/books", createBook);
  app.put("/api/books/:id", updateBook);
  app.delete("/api/books/:id", deleteBook);
  app.get("/api/stats", getStats);
  app.post("/api/seed", seedDatabase);

  return app;
}
