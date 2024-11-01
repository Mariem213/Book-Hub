import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
// import googleLogo from '../static/imgs/GoogleLogo.svg'; // Adjust path as necessary
import { useAuth } from "../context/AuthContext"; // Import the AuthContext
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import "../styles/auth.css"; // Adjust path as necessary

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate(); // Hook for redirecting after successful login
  const { login } = useAuth(); // Correctly call useAuth to get login function

  // Handle form input change
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("http://localhost:3001/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      // If login is successful
      if (response.status === 200) {
        login(response.data.token); // Call the login function with the token
        setSuccess(true);
        setError(null);
        navigate("/"); // Redirect to home page or dashboard
      }
    } catch (err) {
      // Handle error
      setError(err.response?.data?.message || "An error occurred during login");
      setSuccess(false);
    }
  };

  return (
    <div>
      {/* Two-column layout with image on the left and form on the right */}
      <Container fluid className="d-flex full-height">
        <Row className="w-100">
          {/* Left Column: Background Image */}
          <Col
            md={6}
            className=" ImageLogSign d-none d-md-flex bg-image-container align-items-center justify-content-center"
          >
            {/* This column has no content, background image is applied via CSS */}
          </Col>
          {/* Right Column: Login Form */}
          <Col
            md={6}
            className="d-flex align-items-center justify-content-center"
          >
            <div className="login-form">
              <Form onSubmit={handleSubmit}>
                <h2 className="text-center my-2 ">Welcome to Book Store</h2>

                {/* Display error and success messages */}
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">Login successful!</Alert>}

                {/* Email Input */}
                <Form.Group controlId="email">
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="my-4 py-2"
                  />
                </Form.Group>

                {/* Password Input */}
                <Form.Group controlId="password">
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="my-4 py-2"
                  />

                  {/* Remember Me Checkbox */}
                  <Form.Group
                    controlId="rememberMe"
                    className="customRememberMe"
                  >
                    <Form.Check type="checkbox" label="Remember Me" />
                    <Link to="/resetPass" className="forgot-password">
                      Forgot Password?
                    </Link>
                  </Form.Group>

                  {/* <Form.Text className="text-right">
                    
                  </Form.Text> */}
                </Form.Group>

                {/* Submit Button */}
                <Button type="submit" className="w-100 button-color">
                  Log in
                </Button>

                {/* Link to Signup */}
                <p className="text-center mt-3">Don't have an account? </p>
                <Link to="/signup" className="signup">
                  Create a new account
                </Link>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
