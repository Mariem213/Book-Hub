import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import "../styles/profile.css";

const EditBook = () => {
  const { id } = useParams(); // Get book ID from URL parameters
  const [book, setBook] = useState({
    title: '',
    author: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    publishedYear: '',
    publisher: '',
    rating: '',
    coverImage: '',
    isbn: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch the current book details
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await api.get(`http://localhost:3001/api/books/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        });
        setBook(response.data);
      } catch (error) {
        console.error('Error fetching book details:', error);
        setError('Failed to fetch book details.');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'coverImage') {
      setBook({
        ...book,
        coverImage: e.target.files[0], // Set the selected file
      });
    } else {
      setBook({
        ...book,
        [name]: value,
      });
    }
    // setBook((prevBook) => ({
    //   ...prevBook,
    //   [name]: value,
    // }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSubmit = new FormData();
    formDataToSubmit.append('title', book.title);
    formDataToSubmit.append('description', book.description);
    formDataToSubmit.append('price', book.price);
    formDataToSubmit.append('stock', book.stock);

    // If a new cover image is provided, append it
    if (book.coverImage) {
      formDataToSubmit.append('coverImage', book.coverImage);
    }

    try {
      await api.put(`http://localhost:3001/profile/${id}`, formDataToSubmit, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',  // Ensure multipart data is being sent
        }
      });
      alert('Book updated successfully!');
      navigate('/profile'); // Redirect to My Posts after updating
    } catch (error) {
      console.error('Error updating book:', error);
      setError('Failed to update book. Please try again.');
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="EditBookHeader">Edit Book</h2>
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        <>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formTitle" className="mb-3">
              <Form.Label style={{ fontWeight:700, color:"#3C486B" }}>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter book title"
                name="title"
                value={book.title}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formAuthor" className="mb-3">
              <Form.Label style={{ fontWeight:700, color:"#3C486B" }}>Author</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter author's name"
                name="author"
                value={book.author}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formDescription" className="mb-3">
              <Form.Label style={{ fontWeight:700, color:"#3C486B" }}>Description</Form.Label>
              <Form.Control
                as="textarea"
                style={{ resize: "none"}}
                rows={3}
                placeholder="Enter book description"
                name="description"
                value={book.description}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formCategory" className="mb-3">
              <Form.Label style={{ fontWeight:700, color:"#3C486B" }}>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter book category"
                name="category"
                value={book.category}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formPrice" className="mb-3">
              <Form.Label style={{ fontWeight:700, color:"#3C486B" }}>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter book price"
                name="price"
                value={book.price}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formStock" className="mb-3">
              <Form.Label style={{ fontWeight:700, color:"#3C486B" }}>Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter available stock"
                name="stock"
                value={book.stock}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formPublishedYear" className="mb-3">
              <Form.Label style={{ fontWeight:700, color:"#3C486B" }}>Published Year</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter published year"
                name="publishedYear"
                value={book.publishedYear}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formPublisher" className="mb-3">
              <Form.Label style={{ fontWeight:700, color:"#3C486B" }}>Publisher</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter publisher name"
                name="publisher"
                value={book.publisher}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formRating" className="mb-3">
              <Form.Label style={{ fontWeight:700, color:"#3C486B" }}>Rating</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter book rating (1-5)"
                name="rating"
                value={book.rating}
                onChange={handleChange}
                min="1"
                max="5"
              />
            </Form.Group>

            <Form.Group controlId="formCoverImage" className="mb-3">
              <Form.Label style={{ fontWeight:700, color:"#3C486B" }}>Cover Image URL</Form.Label>
              <Form.Control
                type="file" 
                name="coverImage" 
                accept="image/*" 
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formISBN" className="mb-3">
              <Form.Label style={{ fontWeight:700, color:"#3C486B" }}>ISBN</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter ISBN"
                name="isbn"
                value={book.isbn}
                onChange={handleChange}
              />
            </Form.Group>

            <button className="bttn mb-4" type="submit">
              Update Book
            </button>
          </Form>
        </>
      )}
    </Container>
  );
};

export default EditBook;
