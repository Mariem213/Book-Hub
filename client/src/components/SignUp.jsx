import React, { useState } from 'react';
import { Container, Form, Button, Alert , Col, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext'; // Import the AuthContext
import '../styles/auth.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "", // Add username field to the formData state
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const { login } = useAuth(); // Correctly call useAuth to get login function

  // Handle form input change
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("كلمات المرور غير متطابقة");
      return;
    }

    try {
      const response = await api.post("http://localhost:3001/api/auth/signup", {
        name: formData.name,
        username: formData.username, // Include username in the API request
        email: formData.email,
        password: formData.password,
      });

      // If sign-up is successful
      if (response.status === 201) {
        // Automatically log in the user after successful registration
        login(response.data.token); // Assuming the API returns a token

        setSuccess(true);
        setError(null);

        // Redirect after a short delay
        setTimeout(() => {
          navigate("/"); // Redirect to home page
        }, 2000);
      }
    } catch (err) {
      // Handle error
      setError(err.response?.data?.message || "حدث خطأ أثناء التسجيل");
      setSuccess(false);
    }
  };

  return (
    <div className='logCon'>
      <Container fluid className="d-flex">
        <Row className="w-100">
          <Col md={6} className=" ImageLogSign d-none d-md-flex bg-image-container align-items-center justify-content-center"></Col>
          <Col
            md={6}
            className="d-flex align-items-center justify-content-center"
          >
            <div className="login-form">
              <Form onSubmit={handleSubmit}>
                <h2 className="text-center">Create a New Account</h2>
                <br />

                {error && <Alert variant="danger">{error}</Alert>}
                {success && (
                  <Alert variant="success">
                    Account created successfully! You will be redirected to the
                    homepage...
                  </Alert>
                )}

                <Form.Group controlId="name">
                  <Form.Control
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="username">
                  {/* Add username input field */}
                  <Form.Control
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="email">
                {" "}
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="password">
                  <Form.Control
                    type="password"
                    placeholder="Password (in English)"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="confirmPassword">
                  <Form.Control
                    type="password"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Button type="submit" className="w-100 button-color">
                  Create Account
                </Button>

                <p className="text-center mt-3">Already have an account?</p>
                <Link to="/login" className="login">
                  Login
                </Link>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SignUp;
