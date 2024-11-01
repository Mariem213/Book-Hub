import React, { useState } from "react";
import { Form, Button, Col, Row, Alert, Spinner } from "react-bootstrap";
import {  FaDollarSign, FaAsterisk } from "react-icons/fa";
import { AiOutlineCloudUpload } from "react-icons/ai";
import api from '../api/api'; // Import your API instance
import "../styles/profile.css";

const BookPostForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    price: "",
    stock: "",
    coverImage: null, // For image upload
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "coverImage") {
      setFormData({ ...formData, coverImage: e.target.files[0] }); // Handle image file upload
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    // Ensure price and stock are not negative
    if (formData.price < 0 || formData.stock < 0) {
      setErrorMessage("Price and stock cannot be negative values.");
      setLoading(false);
      return;
    }

    try {
      const formDataObj = new FormData();
      formDataObj.append("title", formData.title);
      formDataObj.append("author", formData.author);
      formDataObj.append("description", formData.description);
      formDataObj.append("price", formData.price);
      formDataObj.append("stock", formData.stock);
      if (formData.coverImage) formDataObj.append("coverImage", formData.coverImage);

      const response = await api.post("http://localhost:3001/api/books/post", formDataObj, {
        headers: { "Content-Type": "multipart/form-data" }, // Necessary for file upload
      });

      if (response.status === 201) {
        setSuccessMessage("Book added successfully!");
        setFormData({
          title: "",
          author: "",
          description: "",
          price: "",
          stock: "",
          coverImage: null,
        });
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group controlId="formTitle" className="mb-3">
              <Form.Label style={{ fontWeight:700, color:"#3C486B" }}>
                Title <FaAsterisk className="text-danger" />
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter book title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="formAuthor" className="mb-3">
              <Form.Label style={{ fontWeight:700, color:"#3C486B" }}>Author</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter author's name"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group controlId="formPrice" className="mb-3">
              <Form.Label style={{ fontWeight:700, color:"#3C486B" }}>
                Price <FaDollarSign /> <FaAsterisk className="text-danger" />
              </Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="formStock" className="mb-3">
              <Form.Label style={{ fontWeight:700, color:"#3C486B" }}>
                Stock <FaAsterisk className="text-danger" />
              </Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter stock quantity"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="formCoverImage" className="mb-3">
          <Form.Label style={{ fontWeight:700, color:"#3C486B" }}>Cover Image</Form.Label>
          <Form.Control
            type="file"
            name="coverImage"
            onChange={handleChange}
            accept="image/*"
          />
          <Form.Text className="text-muted">Upload a cover image for the book</Form.Text>
        </Form.Group>

        <Form.Group controlId="formDescription" className="mb-3">
          <Form.Label style={{ fontWeight:700, color:"#3C486B" }}>Description</Form.Label>
          <Form.Control
            as="textarea"
            style = {{ resize: 'none' }}
            rows={3}
            placeholder="Enter book description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </Form.Group>

        <button
          className="bttn mb-4 mt-3 w-100"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner animation="border" size="sm" /> Posting...
            </>
          ) : (
            <>
              <AiOutlineCloudUpload /> Post Book
            </>
          )}
        </button>
      </Form>
    </div>
  );
};

export default BookPostForm;
