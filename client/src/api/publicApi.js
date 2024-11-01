import axios from 'axios';

// Create an Axios instance for the Google Books API with API key
const googleBooksApiWithKey = axios.create({
  baseURL: 'https://www.googleapis.com/books/v1', // Base URL for Google Books API
});

// Create an Axios instance for the Google Books API without API key
const googleBooksApiWithoutKey = axios.create({
  baseURL: 'https://www.googleapis.com/books/v1', // Base URL for Google Books API
});

// Fetch books function using Google Books API
export const fetchBooks = async (searchTerm) => {
  const apiKey = process.env.REACT_APP_GOOGLE_BOOKS_API_KEY;

  // Check if the API key is available
  if (apiKey) {
    try {
      // Fetch from Google Books API with the API key
      const res = await googleBooksApiWithKey.get(`/volumes?q=${searchTerm}&key=${apiKey}`);
      return res.data.items || []; // Return items from Google Books API
    } catch (error) {
      console.error(`Error fetching from Google Books API with key:`, error);
      
      // Handle rate limiting or other errors
      if (error.response?.status === 429) {
        console.warn('Rate limit exceeded for Google Books API with key.');
      }
    }
  }

  // If no API key is found or the request with the key fails, try without the key
  try {
    const resWithoutKey = await googleBooksApiWithoutKey.get(`/volumes?q=${searchTerm}`);
    return resWithoutKey.data.items || []; // Return items from Google Books API
  } catch (errorWithoutKey) {
    console.error(`Error fetching from Google Books API without key:`, errorWithoutKey);
    return []; // Return empty array in case of failure
  }
};
