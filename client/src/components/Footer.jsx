import React from "react";
import { Container, Row, Col, Nav, Button } from "react-bootstrap";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "font-awesome/css/font-awesome.min.css"; // Ensure you have Font Awesome included
import "../styles/Footer.css"; // Adjust path as necessary
// import '../styles/auth.css';
const Footer = () => {
  return (
    <footer className="footer text-light">
      <Container>
        <Row className="">
          {/* Left Column - Copyright and Links */}
          <Col md={4} className="text-md-start ">
            <Nav className="flex-column mt-2">
              <Nav.Link href="#" className="text-light p-0">
                Terms of Use
              </Nav.Link>
              <Nav.Link href="#" className="text-light p-0">
                Privacy Policy
              </Nav.Link>
            </Nav>
          </Col>

          {/* Middle Column - Social Media Icons */}
          <Col md={4} className="text-md-center">
            <Button variant="link" className="text-light ">
              <i className="fa fa-youtube"></i>
            </Button>
            <Button variant="link" className="text-light btn-link">
              <i className="fa fa-facebook-f"></i>
            </Button>
            <Button variant="link" className="text-light btn-link">
              <i className="fa fa-twitter"></i>
            </Button>
            <Button variant="link" className="text-light btn-link">
              <i className="fa fa-instagram"></i>
            </Button>
            <Button variant="link" className="text-light btn-link">
              <i className="fa fa-linkedin"></i>
            </Button>
            <Button variant="link" className="text-light btn-link">
              <i className="fa fa-whatsapp"></i>
            </Button>

            <p>© BookHub | 2024</p>
          </Col>

          {/* Right Column - Navigation Links */}
          <Col md={4} className="text-md-end">
            <Nav className="flex-column">
              <Nav.Link href="#" className="text-light p-0 ">
                Help
              </Nav.Link>
              {/* <Nav.Link href="#" className="text-light p-0">
                Payment Methods
              </Nav.Link> */}
              <Nav.Link href="#" className="text-light p-0">
                How to Use and Purchase
              </Nav.Link>
              <Nav.Link href="/about" className="text-light p-0">
                About Us
              </Nav.Link>
            </Nav>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
