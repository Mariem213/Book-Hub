import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import Rating from 'react-rating'; // Import the rating package
import { FaStar } from 'react-icons/fa'; // Import star icons from react-icons
import api from '../api/api'; // Import the custom Axios instance
import '../styles/apiSearch.css';

const BookDetails = ({ selectedBook }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Reset state when the selectedBook changes
  useEffect(() => {
    setRating(0);
    setReview('');
    setSuccessMessage('');
    setErrorMessage('');
  }, [selectedBook]);

  if (!selectedBook) {
    return <p>Please select a book to see details.</p>;
  }

  const { title, authors, description, imageLinks, averageRating, pageCount, publishedDate } = selectedBook.volumeInfo;

  const submitReview = async (e) => {
    e.preventDefault();

    // Prepare the review data
    const reviewData = {
      bookId: selectedBook.id, // Assuming you have a unique ID for the book
      rating,
      review,
      bookName: title
    };

    try {
      // Make a POST request to the backend to submit the review using the custom api instance
      const response = await api.post('/reviews', reviewData);

      // Handle successful submission
      setSuccessMessage(response.data.message);
      setErrorMessage(''); // Clear any previous error messages
      setRating(0); // Reset the rating
      setReview(''); // Clear the review text
    } catch (error) {
      console.error(error);
      setErrorMessage(error.response ? error.response.data.msg : 'Server error');
      setSuccessMessage(''); // Clear any previous success messages
    }
  };

  return (
    <div className="container-fluid con">
      <Row className="justify-content-md-center">
        <Col md={8}>
          {/* Book Information */}
          <Card style={{ backgroundColor: "#fefefe", margin: "7rem auto 3rem" }}>
            <Card.Title className="w-100 text-center" style={{ color: '#3C486B', fontSize: '2.5rem', fontWeight:'bold', margin:"1rem 0" }}>{title}</Card.Title>
            <div className='CardCon'>
              <div className='ImgCon'>
                <img className='imgResult' src={imageLinks?.thumbnail || 'placeholder.jpg'} alt={title} />
              </div>
              <div className='BookDataCon'>
                <Card.Body>
                  <Card.Text style={{ fontSize:"1.1rem" }}>
                    <strong>Authors:</strong> {authors?.join(', ') || 'Unknown'}
                  </Card.Text>
                  <Card.Text style={{ fontSize:"1.1rem" }}>
                    <strong>Published Date:</strong> {publishedDate || 'N/A'}
                  </Card.Text>
                  <Card.Text style={{ fontSize:"1.1rem" }}>
                    <strong>Average Rating:</strong> {averageRating || 'N/A'}
                  </Card.Text>
                  <Card.Text style={{ fontSize:"1.1rem" }}>
                    <strong>Page Count:</strong> {pageCount || 'N/A'}
                  </Card.Text>
                  <Card.Text style={{ fontSize:"1.1rem", textAlign: 'justify' }}>
                    <strong>Description:</strong><br/> {description || 'No description available.'}
                  </Card.Text>
                </Card.Body>
                {/* Review Form */}
                <Card className='m-3'>
                  <Card.Body>
                    <h5 style={{ color: "#3C486B", fontWeight: "bold" }}>Submit Your Review</h5>
                    {successMessage && <Alert variant="success">{successMessage}</Alert>}
                    {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                    <Form onSubmit={submitReview}>
                      <Form.Group controlId="rating" className="mb-3">
                        <Form.Label style={{ fontSize:"1.1rem" }}>Rating (out of 5)</Form.Label>
                        <Rating
                          emptySymbol={<FaStar color="lightgray" />} // Empty stars
                          fullSymbol={<FaStar color="gold" />} // Filled stars
                          fractions={2} // Allow half-star ratings
                          initialRating={rating}
                          onChange={(rate) => setRating(rate)} // Update rating on change
                        />
                      </Form.Group>

                      <Form.Group controlId="review" className="mb-3">
                        <Form.Label style={{ fontSize:"1.1rem" }}>Review</Form.Label>
                        <Form.Control
                          as="textarea"
                          style={{ resize: "none"}}
                          rows={3}
                          value={review}
                          onChange={(e) => setReview(e.target.value)}
                          required
                        />
                      </Form.Group>

                      <button className="bttn mb-4" type="submit">
                        Submit Review
                      </button>
                    </Form>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BookDetails;
