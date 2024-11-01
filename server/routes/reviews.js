const express = require('express');
const router = express.Router();
const Review = require('../models/Reviews');
const User = require('../models/User');
const authenticateToken = require('../middleware/authenticateToken'); // Middleware for checking token

// POST /api/reviews - Submit a review (Protected route)
router.post('/reviews', authenticateToken, async (req, res) => {
    const { bookId, rating, review, bookName } = req.body;

    try {
        // Ensure that the user is authenticated
        const userId = req.user.userId; // Access the userId from the token payload
        const user = await User.findById(userId); // Fetch the user by userId

        // Check if the user is found
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Extract the username from the user document
        const username = user.username;

        // Create a new review with userId and username
        const newReview = new Review({ bookId, userId, rating, review, bookName, username });
        await newReview.save();

        res.status(201).json({ message: 'Review submitted successfully' });
    } catch (error) {
        console.error('Error saving review:', error);
        res.status(500).json({ message: 'Failed to submit review', error });
    }
});

// GET /api/reviews/user - Fetch user reviews (Protected route)
router.get('/user', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId; // Get user ID from the token
        const reviews = await Review.find({ userId }); // Fetch reviews for the authenticated user
        
        res.json(reviews); // Return the reviews as JSON
    } catch (error) {
        console.error('Error fetching user reviews:', error);
        res.status(500).json({ message: 'Error fetching reviews' });
    }
});

// GET /api/reviews/username/:username - Search for reviews by username (Public route)
router.get('/reviews/username/:username', async (req, res) => {
    
    const { username } = req.params;
    
    try {
        // Find reviews by the username
        const reviews = await Review.find({ username });

        if (reviews.length === 0) {
            return res.status(404).json({ message: 'No reviews found for this user' });
        }
        console.log(reviews);
        
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews by username:', error);
        res.status(500).json({ message: 'Error fetching reviews' });
    }
});

module.exports = router;
