import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Table,
  Modal,
  Form,
  Toast
} from "react-bootstrap";
import api from "../api/api"; // Import your API instance
import "bootstrap/dist/css/bootstrap.min.css";
import { FaShoppingCart } from "react-icons/fa";
import "../styles/profile.css";

const CartPage = ({ cartItems, onRemoveItem, onCheckout }) => {
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showToast, setShowToast] = useState(false); // State for showing success toast
  const [selectedBookId, setSelectedBookId] = useState(null); // To store the ID of the book to be purchased
  const token = localStorage.getItem("token"); // Assuming token is stored in localStorage

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      setShowModal(true); // Show the modal when proceeding to checkout
    } else {
      setErrorMessage(
        "Your cart is empty. Please add items to your cart before checking out."
      );
    }
  };

  const handleConfirm = async () => {
    console.log("Confirm button clicked");
    console.log("Password entered:", password); // Log the password

    try {
      // Create a JSON payload with the password
      const payload = { password };

      // Send the request as JSON
      const response = await api.post("/books/validate-password", payload, {
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
          Authorization: `Bearer ${token}`, // JWT token for authentication
        },
      });

      const result = response.data; // Axios returns the result in `response.data`

      if (response.status === 200) {
        console.log("Password validation success:", result.message);

        // Now you can proceed to update stock or finalize the purchase
        const stockUpdateResponse = await api.post(
          `/books/buy/${selectedBookId}`,
          { quantity: 1 },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const stockUpdateResult = stockUpdateResponse.data;

        if (stockUpdateResponse.status === 200) {
          console.log("Checkout success:", stockUpdateResult.message);
          setShowModal(false); // Close the modal on success
          setErrorMessage(""); // Clear any error message
          setShowToast(true); // Show success toast
          onRemoveItem(selectedBookId); // Remove the book from the cart
          onCheckout(); // Call the onCheckout function to refresh the cart or redirect
        } else {
          console.log("Checkout failed:", stockUpdateResult.message);
          setErrorMessage(
            stockUpdateResult.message ||
            "Something went wrong. Please try again."
          );
        }
      } else {
        console.log("Password validation failed:", result.message);
        setErrorMessage(
          result.message || "Invalid password. Please try again."
        );
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      setErrorMessage("Server error. Please try again later.");
    }
  };

  const handleSelectBookForCheckout = (bookId) => {
    setSelectedBookId(bookId);
    setShowModal(true); // Show the modal for password input when a book is selected for checkout
  };

  return (
    <Container className="custom-searchResult-margin">
      <Row>
        <Col>
          {/* <h3>Your Cart</h3> */}
          {cartItems.length > 0 ? (
            <>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item._id}>
                      <td>{item.title}</td>
                      <td>{item.author}</td>
                      <td>${item.price}</td>
                      <td>{item.quantity}</td>
                      <td>${(item.price * item.quantity).toFixed(2)}</td>
                      <td className="BtnCon">
                        <Button
                          className="bttn"
                          onClick={() => onRemoveItem(item._id)}
                        >
                          Remove
                        </Button>
                        <Button
                          className="bttn"
                          onClick={() => handleSelectBookForCheckout(item._id)}
                        >
                          Buy
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {/* <Button variant="success" onClick={handleCheckout}>
                Proceed to Checkout
              </Button> */}
              {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}{" "}
              {/* Display error message */}
            </>
          ) : (
            <Container className="text-center mt-5">
              {/* Shopping cart icon */}
              <Row className="justify-content-center">
                <Col md={6}>
                  <FaShoppingCart size={150} className="text-secondary mb-3" />
                </Col>
              </Row>

              {/* Heading */}
              <Row className="justify-content-center">
                <Col md={8}>
                  <h2>Your Cart Is Currently Empty!</h2>
                  <p className="text-muted">
                    Before proceeding to checkout, you must add some products to
                    your shopping cart. You will find a lot of interesting
                    products on our "Shop" page.
                  </p>
                </Col>
              </Row>
            </Container>
          )}
        </Col>
      </Row>

      {/* Password Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Checkout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </Form.Group>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Success Toast for Purchase Confirmation */}
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
        style={{ position: "absolute", top: "100px", right: "20px" }}
      >
        <Toast.Body>
          <span role="img" aria-label="check">
            ✅
          </span>{" "}
          Purchase successful! Thank you for your order.
        </Toast.Body>
      </Toast>
    </Container>
  );
};

export default CartPage;
