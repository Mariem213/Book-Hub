import React, { useState } from "react";
import { Row, Col, Form, Card, Spinner, Alert } from "react-bootstrap";
import { FaSearch, FaShoppingCart, FaPlusCircle } from "react-icons/fa";
import api from "../api/api"; // Import your API instance
import "../styles/Book.css";

const Book = ({ cartItems, setCartItems }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [bookData, setBookData] = useState([]); // Change to an array
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Track success message

  // Handle book search
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    setBookData([]); // Reset bookData to an empty array

    try {
      const response = await api.get(
        `/books/search?query=${encodeURIComponent(searchQuery)}`
      );

      if (response.status === 200) {
        const data = await response.data;

        if (Array.isArray(data) && data.length > 0) {
          setBookData(data);
        } else {
          setErrorMessage("No books found.");
          setBookData([]);
        }
      } else {
        throw new Error("Book not found");
      }
    } catch (error) {
      setErrorMessage(error.message || "An error occurred during search");
    } finally {
      setLoading(false);
    }
  };

  // Handle adding book to cart
  const handleAddToCart = (bookId) => {
    const selectedBook = bookData.find((book) => book._id === bookId);

    if (selectedBook) {
      // Check if the book is already in the cart
      const existingBook = cartItems.find(
        (item) => item._id === selectedBook._id
      );
      if (existingBook) {
        // Update the quantity if the book already exists in the cart
        setCartItems(
          cartItems.map((item) =>
            item._id === selectedBook._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        // Add the book to the cart with quantity 1
        setCartItems([...cartItems, { ...selectedBook, quantity: 1 }]);
      }

      // Show success message
      setSuccessMessage(`"${selectedBook.title}" has been added to the cart.`);

      // Hide the success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  return (
    <div className="mt-5 bookcon">
      <Row style={{ width: "99.5%" }}>
        <Col>
          <div className="p-4 custom-searchResult-margin container">
            {/* <h3 className="text-center mb-4">Search and Buy a Book</h3> */}
            <h3
              className="text-center mb-4"
              style={{ color: "#3C486B", fontSize: "2.5rem" }}
            >
              Discover books you'll Buy{" "}
            </h3>
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            {successMessage && (
              <Alert variant="success">{successMessage}</Alert>
            )}{" "}
            {/* Success alert */}
            <Form onSubmit={handleSearch} className="mb-4">
              <Row>
                <div
                  className="searchCon"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div md={9}>
                    <Form.Group
                      controlId="formSearch"
                      className="mb-3 InputBuy"
                    >
                      {/* <Form.Label>Search by Title or Author <span className="text-danger">*</span></Form.Label> */}
                      <Form.Control
                        className="InputBuyControl"
                        type="text"
                        style={{
                          width: "30rem",
                          padding: "0.7rem",
                          marginTop: "1rem",
                        }}
                        placeholder="Search for a book by title or author..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </div>
                  <div md={3}>
                    <button
                      className="btttn mb-4 mt-4"
                      style={{ margin: "2rem", width: "15rem" }}
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        <>
                          <FaSearch /> Search
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </Row>
            </Form>
            <div className="container">
              {bookData.length > 0 ? (
                bookData.map((book) => (
                  <Card className="mb-4" key={book._id}>
                    <Card.Body>
                      <Card.Title
                        className="w-100 text-center"
                        style={{ color: "#3C486B" }}
                      >
                        {book.title}
                      </Card.Title>
                      <Row className="mb-3 text-center">
                        <Col md={6}>
                          <Card.Subtitle className="mb-1 text-muted">
                            <strong style={{ color: "#3C486B" }}>
                              Author:
                            </strong>{" "}
                            {book.author}
                          </Card.Subtitle>
                        </Col>
                        <Col md={6}>
                          <Card.Text className="mb-0">
                            <strong style={{ color: "#3C486B" }}>Price:</strong>{" "}
                            ${book.price}
                          </Card.Text>
                        </Col>
                      </Row>
                      <Card.Text className="text-center">
                        <strong style={{ color: "#3C486B" }}>
                          Description:
                        </strong>
                      </Card.Text>
                      <Card.Text className="text-center">
                        {book.description}
                      </Card.Text>
                      <Card.Text className="text-center">
                        <strong style={{ color: "#3C486B" }}>
                        User Name:
                        </strong>
                        {book.username}
                      </Card.Text>

                      <div className="d-flex justify-content-center">
                        <button
                          className="btttn mb-4 mt-2"
                          onClick={() => handleAddToCart(book._id)} // Trigger add to cart
                        >
                          <FaShoppingCart /> Add to Cart
                        </button>
                      </div>
                    </Card.Body>
                    {/* </div> */}
                  </Card>
                ))
              ) : (
                <p className="text-muted  text-center">No books to display</p>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Book;
