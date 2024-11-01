import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Modal, Image } from 'react-bootstrap';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import { FaPlusCircle } from "react-icons/fa";
import BookPostForm from "./BookPostForm";
import "../styles/profile.css";

const Profile = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get('http://localhost:3001/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        });
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
        setError('Failed to fetch your books.');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const handleDelete = async (bookId) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await api.delete(`http://localhost:3001/profile/${bookId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        });
        setBooks(books.filter(book => book._id !== bookId));
      } catch (error) {
        console.error('Error deleting book:', error);
        setError('Failed to delete the book.');
      }
    }
  };

  const fetchBookDetails = async (bookId) => {
    try {
      const response = await api.get(`http://localhost:3001/api/books/${bookId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      setSelectedBook(response.data);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching book details:', error);
      setError('Failed to fetch book details.');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBook(null);
  };

  const togglePostForm = () => setShowPostForm(!showPostForm);

  return (
    <div className="container-fluid con">
      <div className=" ProfileCon container-fluid">
        <h1 className=" ProfileHeader" >My Books</h1>
        <Row>
          <Col className="text-center">
            <button
              onClick={togglePostForm}
              className="bttn mb-4"
            >
              <FaPlusCircle /> Post a Book for Sale
            </button>

            <Modal show={showPostForm} onHide={togglePostForm} centered>
              <Modal.Header closeButton>
                <Modal.Title className="w-100 text-center" style={{ color: '#3C486B' }}>Post a Book</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <BookPostForm />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={togglePostForm}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </Col>
        </Row>
      </div>
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        <>
          {error && <Alert variant="danger">{error}</Alert>}
          <Container>
            <Row>
              {books.map((book) => (
                <Col md={6} lg={4} key={book._id} className="mb-4">
                  <Card className="Card">
                    <Card.Body className="cardBody">
                      <h1 className="CardTitle">{book.title}</h1>
                      <Card.Text className="CardBodytxt">
                        <strong>Author:</strong> {book.author}<br />
                        <strong>Price:</strong> ${book.price}<br />
                        <strong>Stock:</strong> {book.stock || 'N/A'}<br />
                      </Card.Text>
                      <div className="BtnCon">
                        <button className="bttn" onClick={() => fetchBookDetails(book._id)}>View Details</button>
                        <button className="bttn" onClick={() => navigate(`/edit-book/${book._id}`)}>Edit</button>
                        <button className="bttn" onClick={() => handleDelete(book._id)}>Delete</button>
                      </div>
                    </Card.Body>
                    <div className='CardImgCon'>
                      <img className="CardImg" src={`http://localhost:3001/${book.coverImage}`} alt={book.title} />
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>

          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title className="w-100 text-center" style={{ color: '#3C486B' }}>{selectedBook?.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedBook && (
                <>
                  <img
                    src={`http://localhost:3001/${selectedBook.coverImage}`}
                    alt={selectedBook.title}
                    className="img-fluid mb-3 ModelDetailImage"
                  />
                  <div className="ModelDetailtxt">
                    <p><strong>Author:</strong> {selectedBook.author}</p>
                    <p><strong>Description:</strong> {selectedBook.description}</p>
                    <p><strong>Category:</strong> {selectedBook.category}</p>
                    <p><strong>Published Year:</strong> {selectedBook.publishedYear}</p>
                    <p><strong>Publisher:</strong> {selectedBook.publisher}</p>
                    <p><strong>Price:</strong> {selectedBook.price}</p>
                    <p><strong>Stock:</strong> {selectedBook.stock}</p>
                    <p><strong>Rating:</strong> {selectedBook.rating || 'N/A'}</p>
                    <p><strong>ISBN:</strong> {selectedBook.isbn || 'N/A'}</p>
                  </div>
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </div>
  );
};

export default Profile;
