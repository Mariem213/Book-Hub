const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  stock: { type: Number, required: true, min: 0 }, // Ensure stock cannot be negative
  coverImage: String, // URL or file path for the image
  addedBy: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, // Reference to the user who added the book
});

bookSchema.index({ title: 1, author: 1 }, { unique: true }); // Make title and author unique together

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
