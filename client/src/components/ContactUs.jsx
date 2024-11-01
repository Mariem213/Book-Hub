import React from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import "../styles/profile.css";

const ContactUs = () => {
  return (
    // <Container className="d-flex align-items-center justify-content-center vh-100">
    // <Container style={{ backgroundColor: "#eee", height: "60vh", border: "1px solid #ccc", borderRadius: "25px", position: 'absolute', bottom: "1rem" }}>
    <Container
      style={{
        backgroundColor: "#eee",
        height: "auto",
        border: "1px solid #ccc",
        borderRadius: "25px",
        marginBlock: "5rem",
      }}
    >
      <h1
        className="text-center"
        style={{ color: "#3C486B", marginTop: "1rem" }}
      >
        Contact Us
      </h1>
      <Row className="w-100 d-flex align-items-center justify-content-center">
        <Col md={6}>
          <h3>Get in Touch</h3>
          <p>
            If you have any questions, feel free to reach out to us using the
            form below.
          </p>
        </Col>
        <Col md={6}>
          <Form style={{}}>
            <Form.Group controlId="formName">
              <Form.Label style={{ fontSize: "1.1rem", color: "#3C486B" }}>
                Name
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                required
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label
                style={{
                  fontSize: "1.1rem",
                  color: "#3C486B",
                  marginTop: "1rem",
                }}
              >
                Email
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                required
              />
            </Form.Group>
            <Form.Group controlId="formMessage">
              <Form.Label
                style={{
                  fontSize: "1.1rem",
                  color: "#3C486B",
                  marginTop: "1rem",
                }}
              >
                Message
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                style={{ resize: "none" }}
                placeholder="Your message"
                required
              />
            </Form.Group>
            <button className="bttn mb-4 mt-3" type="submit">
              Submit
            </button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactUs;
