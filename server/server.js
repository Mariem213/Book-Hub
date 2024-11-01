const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const reviewRoutes = require('./routes/reviews');
const bookRoutes = require('./routes/bookRoutes');
const profileRoutes = require('./routes/profileRoutes');



require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());

// Enable CORS for all routes
app.use(cors({
    origin: 'http://localhost:3000', // Allow your frontend origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed methods
    credentials: true, // Allow credentials (if needed)
  }));
  
// Routes
app.use('/api/auth', authRoutes);
app.use('/api', reviewRoutes);
app.use('/api/books', bookRoutes);
app.use('/profile',profileRoutes);
app.use('/api/books', bookRoutes);
app.use('/uploads', express.static('uploads'));
app.use(express.static('public'));



// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));


// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
