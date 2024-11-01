import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../styles/about.css";
import "../styles/profile.css";
import ContactUs from "./ContactUs";

const About = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  return (
    <Container fluid className="about-us-section">
      {/* Header Section with Background Image */}
      <Row className="about-us-header ">
        <Col>
          <div className="header-content text-center">
            <h1 className="text-light">About Us</h1>
            <p className="text-light">
              BookHub is a free service that helps millions of readers discover
              books they'll love while providing publishers and authors with a
              way to drive sales and find new fans.
            </p>
          </div>
        </Col>
      </Row>

      {/* About Us Content */}
      <Row className="justify-content-center text-center mb-5">
        <Col md={8}>
          <h1 className="text-mission mt-5">Our Mission</h1>
          <p>
            Upon joining, members receive unbeatable deals selected by our
            expert editorial team, handpicked recommendations from people they
            trust, and real-time updates from their favorite authors.
          </p>
        </Col>
      </Row>

      {/* Subsections */}
      <Row className="text-center mb-4  d-flex justify-content-center">
        <Col md={5}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>READERS</Card.Title>
              <Card.Text>
                Learn more about how BookHub works and read member testimonials.
              </Card.Text>
              <Button className="bttn" onClick={() => navigate("/")}>
                Share a Review
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={5}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>AUTHORS, PUBLISHERS, AND BOOK MARKETERS</Card.Title>
              <Card.Text>
                BookHub's marketing tools let you connect with millions of power
                readers.
              </Card.Text>
              <Button className="bttn" onClick={() => navigate("/books")}>
                Start Selling
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <ContactUs />
    </Container>
  );
};

export default About;
