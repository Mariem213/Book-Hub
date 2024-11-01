import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner, InputGroup, Form } from 'react-bootstrap';
import { FaSearch, FaUser, FaStar, FaTags } from 'react-icons/fa'; // Import additional icons
import api from '../api/api';
import { fetchBooks } from '../api/publicApi';
import Footer from '../components/Footer';

const HomePage = () => {
  const [userReviews, setUserReviews] = useState([]);
  const [bookDetails, setBookDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openBookId, setOpenBookId] = useState(null);

  const [searchUsername, setSearchUsername] = useState('');
  const [searchedReviews, setSearchedReviews] = useState([]);
  const [bestSellingBooks, setBestSellingBooks] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch current user's reviews
    const fetchUserReviews = async () => {
      try {
        const response = await api.get('/user');
        setUserReviews(response.data);
      } catch (error) {
        console.error('Error fetching user reviews:', error);
        setError('Failed to fetch user reviews.');
      } finally {
        setLoading(false);
      }
    };

    // Fetch best-selling books and books by categories
    const fetchAdditionalData = async () => {
      try {
        const bestSellersResponse = await fetchBooks('best sellers');
        const categoriesResponse = await fetchBooks('fiction'); // Fetch books in categories like fiction, non-fiction, etc.

        setBestSellingBooks(bestSellersResponse);
        setCategories(categoriesResponse);
      } catch (error) {
        console.error('Error fetching additional data:', error);
        setError('Failed to fetch books.');
      }
    };

    fetchUserReviews();
    fetchAdditionalData();
  }, []);

  // Handle search by username
  const handleSearch = async () => {
    try {
      if (searchUsername.trim() === '') {
        setError('Please enter a username to search.');
        return;
      }

      const response = await api.get(`/reviews/username/${searchUsername}`);
      setSearchedReviews(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching searched reviews:', error);
      setSearchedReviews([]);
      setError('Failed to fetch reviews for that user.');
    }
  };

  // Handle clicking a book to view details, with user's rating included
  const handleBookClick = async (review, isFromSearch = false) => {
    const bookId = review.bookId;

    if (openBookId === bookId) {
      setOpenBookId(null);
      setBookDetails(null);
    } else {
      setOpenBookId(bookId);
      try {
        const books = await fetchBooks(review.bookName);
        if (books.length > 0) {
          // Include user's rating in the book details if available
          setBookDetails({ ...books[0], userRating: review.rating, isFromSearch });
        } else {
          setError('No book details found.');
          setBookDetails(null);
        }
      } catch (err) {
        console.error('Error fetching book details:', err);
        setError('Failed to load book details.');
        setBookDetails(null);
      }
    }
  };

  // New function for handling book clicks in best-selling books and categories sections
  const handleBookClick2 = async (bookId) => {
    if (openBookId === bookId) {
      setOpenBookId(null);
      setBookDetails(null);
    } else {
      setOpenBookId(bookId);
      try {
        const books = await fetchBooks(bookId);
        if (books.length > 0) {
          setBookDetails(books[0]);
        } else {
          setError('No book details found.');
          setBookDetails(null);
        }
      } catch (err) {
        console.error('Error fetching book details:', err);
        setError('Failed to load book details.');
        setBookDetails(null);
      }
    }
  };

  return (
    <Container className="d-flex flex-column full-height primDiv">
      <h2 className="text-center mb-4 p-2">Book Hub Dashboard</h2>

      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        <>
          {error && <Alert variant="danger">{error}</Alert>}

          <Row>
            {/* Section for searching reviews by username */}
            <Col md={6} className="mb-4">
              <Card className="secondDiv">
                <Card.Header>
                  <h5>
                    <FaSearch className="me-2" /> Search User Reviews
                  </h5>
                </Card.Header>
                <Card.Body>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaUser />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Enter username"
                      value={searchUsername}
                      onChange={(e) => setSearchUsername(e.target.value)}
                    />
                    <Button variant="primary" onClick={handleSearch}>
                      Search
                    </Button>
                  </InputGroup>

                  {/* Display searched reviews */}
                  {searchedReviews.length > 0 && (
                    <div className="mt-4">
                      <h6>Reviews by {searchUsername}:</h6>
                      <div className="mb-4 d-flex flex-wrap">
                        {searchedReviews.map((review) => (
                          <Button
                            key={review._id}
                            variant="secondary"
                            className="me-2"
                            onClick={() => handleBookClick(review, true)}
                          >
                            {review.bookName || "Unknown"}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>

            {/* Section for current user's reviews */}
            <Col md={6} className="mb-4">
              <Card className="secondDiv">
                <Card.Header>
                  <h5>Your Reviews</h5>
                </Card.Header>
                <Card.Body>
                  <div className="mb-4 d-flex flex-wrap">
                    {userReviews.map((review) => (
                      <Button
                        key={review._id}
                        variant="primary"
                        className="me-2"
                        onClick={() => handleBookClick(review)}
                      >
                        {review.bookName || "Unknown"}
                      </Button>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Section to display book details */}
          {bookDetails && (
            <Row>
              <Col md={12}>
                <Card className="mt-2 secondDiv">
                  <Card.Img
                    className="imgResult"
                    variant="top"
                    src={bookDetails.volumeInfo?.imageLinks?.thumbnail || 'placeholder.jpg'}
                    alt={bookDetails.volumeInfo?.title || 'Unknown'}
                  />
                  <Card.Body>
                    <Card.Title>{bookDetails.volumeInfo?.title || "Unknown"}</Card.Title>
                    <Card.Text>
                      <strong>Authors:</strong> {bookDetails.volumeInfo?.authors?.join(', ') || 'Unknown'}<br />
                      <strong>Published Date:</strong> {bookDetails.volumeInfo?.publishedDate || 'N/A'}<br />
                      <strong>Average Rating:</strong> {bookDetails.volumeInfo?.averageRating || 'N/A'}<br />
                      <strong>Page Count:</strong> {bookDetails.volumeInfo?.pageCount || 'N/A'}<br />
                      <strong>Description:</strong> {bookDetails.volumeInfo?.description || 'No description available.'}<br />

                      {/* Display user's rating if available */}
                      <strong>User's Rating:</strong> {bookDetails.isFromSearch
                        ? searchedReviews.find((review) => review.bookId === bookDetails.id)?.rating || 'No rating provided.'
                        : userReviews.find((review) => review.bookId === bookDetails.id)?.rating || 'No rating provided.'}
                    </Card.Text>

                    {/* Display user's review/comment if available */}
                    <h5>User Review</h5>
                    <Card.Text>{bookDetails.isFromSearch
                      ? searchedReviews.find((review) => review.bookId === bookDetails.id)?.review || 'No review provided.'
                      : userReviews.find((review) => review.bookId === bookDetails.id)?.review || 'No review provided.'}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {/* Best Selling Books Section */}
          <Row>
            <Col md={12} className="mb-4">
              <Card className="primDiv">
                <Card.Header>
                  <h5>
                    <FaStar className="me-2" /> Best Selling Books
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Row className="g-4">
                    {bestSellingBooks.map((book) => (
                      <Col key={book.id} sm={6} md={4} lg={3}>
                        <Card className="h-100 noBorder">
                          <Card.Img variant="top" src={book.volumeInfo.imageLinks?.thumbnail || 'Alt'} />
                          <Card.Body className="primDiv">
                            <Card.Title>{book.volumeInfo.title}</Card.Title>
                            <Button variant="primary" onClick={() => handleBookClick2(book.id)}>
                              View Details
                            </Button>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Books by Category Section */}
          <Row>
            <Col md={12}>
              <Card className="primDiv">
                <Card.Header>
                  <h5>
                    <FaTags className="me-2" /> Books by Categories
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Row className="g-4">
                    {categories.map((book) => (
                      <Col key={book.id} sm={6} md={4} lg={3}>
                        <Card className="h-100 noBorder" onClick={() => handleBookClick2(book.id)}>
                          <Card.Img variant="top" src={book.volumeInfo.imageLinks?.thumbnail || 'Alt'} />
                          <Card.Body className="primDiv">
                            <Card.Title>{book.volumeInfo.title}</Card.Title>
                            <Card.Text style={{ fontSize: "1.1rem" }}>
                              <strong>Authors:</strong> {book.volumeInfo.author}
                            </Card.Text>
                            <Card.Text style={{ fontSize: "1.1rem" }}>
                              <strong>Price:</strong> ${book.volumeInfo.price}
                            </Card.Text>
                            {/* <Button variant="primary" onClick={() => handleBookClick2(book.id)}>
                              View Details
                            </Button> */}
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
      <Footer />
    </Container>
  );
};

export default HomePage;