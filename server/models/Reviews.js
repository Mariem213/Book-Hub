const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    bookId: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, required: true },
    bookName: { type: String, required: true },
    username: String,  


});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
