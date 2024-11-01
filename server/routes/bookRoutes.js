const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");
const Book = require("../models/Book");
const User = require("../models/User"); // Ensure the User model is correctly imported
const authenticateToken = require("../middleware/authenticateToken"); // Middleware for checking JWT token

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Set your desired uploads directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filter to accept only image files
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed.'));
  }
};

// Multer middleware to handle image upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Max size 5MB
  fileFilter: fileFilter
});

// POST: /books/post - Submit a new Book (Protected route)
router.post("/post", authenticateToken, upload.single('coverImage'), async (req, res) => {
  const { title, author, price, stock, description } = req.body;
  const userId = req.user.userId; // Access the userId from token

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required.' });
  }

  // Mandatory fields check
  if (!title || !author || !price || !stock) {
    return res.status(400).json({ message: "Title, author, price, and stock are required fields." });
  }

  // Validate that price and stock are positive numbers
  if (price < 0 || stock < 0) {
    return res.status(400).json({ message: "Price and stock must be positive values." });
  }

  try {
    // Create a new book object
    const newBook = new Book({
      title,
      author,
      price,
      stock,
      description,
      addedBy: userId
    });

    // Attach cover image path if provided
    if (req.file) {
      newBook.coverImage = req.file.path; // Save the file path if coverImage is uploaded
    }

    await newBook.save();
    res.status(201).json({ message: "Book added successfully!", book: newBook });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "A book with the same title and author already exists." });
    }
    console.error(error);
    res.status(500).json({ message: "Server error. Could not add book." });
  }
});

// GET: /books/search - Search for books by title or author
router.get("/search", authenticateToken , async (req, res) => {
  const { query } = req.query; // `query` will be the search input
  
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ message: "Invalid search query." });
  }

  try {
    const userId = req.user ? req.user.userId : null; // Safely access user ID, handle if undefined
    const books = await Book.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } }
      ],
      stock: { $gt: 0 }, // Only include books with stock greater than 0
      addedBy: { $ne: userId } // Exclude books added by the current user

    });

    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Could not fetch books." });
  }
});


// GET: /books/:id - Get Book By Id (with token authentication)
router.get("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params; // Get the book ID from the URL parameters

  try {
    const book = await Book.findById(id).populate('addedBy', 'username email');

    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }

    res.status(200).json(book);
  } catch (error) {
    console.error("Error retrieving book:", error);
    res.status(500).json({ message: "Server error. Could not retrieve book." });
  }
});

// POST: /books/buy/:id - Purchase a book
router.post("/buy/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const book = await Book.findById(id);
    if (!book || book.stock <= 0) {
      return res.status(400).json({ message: "Insufficient stock for this book." });
    }

    // Decrease stock by 1
    book.stock -= 1;
    await book.save();

    // Add the book to user's purchase history (optional)
    // TODO: Add purchase history logic here

    return res.status(200).json({ message: "Purchase successful. Stock updated." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error. Could not complete the purchase." });
  }
});



// POST: /users/validate-password - Validate user password
router.post("/validate-password", authenticateToken, async (req, res) => {
  console.log("Starting password validation");

  const { password } = req.body;  // Extract the password from the request body
  console.log(req.body);  // For debugging, log the incoming request body
  
  const userId = req.user.userId;  // Extract the userId from the authenticated request

  // Check if the password is provided
  if (!password) {
    return res.status(400).json({ message: "Password is required." });
  }

  try {
    // Fetch the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password." });
    }

    // If password is correct
    return res.status(200).json({ message: "Password validated successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error. Could not validate the password." });
  }
});



module.exports = router;
