import mongoose from 'mongoose';

export interface IBook {
  title: string;
  author: string;
  isbn: string;
  publishedDate: string;
  genre: string;
  description: string;
  price: number;
  pages: number;
  language: string;
  inStock: boolean;
  rating: number;
  coverImage?: string;
}

const BookSchema = new mongoose.Schema<IBook>({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
  publishedDate: { type: String, required: true },
  genre: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  pages: { type: Number, required: true },
  language: { type: String, default: 'English' },
  inStock: { type: Boolean, default: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  coverImage: { type: String }
}, {
  timestamps: true
});

export const Book = mongoose.model<IBook>('Book', BookSchema);
