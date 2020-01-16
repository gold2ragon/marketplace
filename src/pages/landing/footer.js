import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class Footer extends Component {
  render() {
    return (
      <Row id="footer">
        <Col lg={6} md={12}>
          <Link className="home-link" to="/">
            TheBizHunt.
          </Link>
          <Link to="/terms-and-conditions">{`Terms & Conditions`}</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/blog">Blog</Link>
        </Col>
        <Col lg={6} md={12}>
          <span className="link company-info">
            &copy;TheBizHunt Pte Ltd
            <br />
            Singapore UEN 201934410G
          </span>
          <span className="link">
            <i className="fa fa-facebook-square"></i>
          </span>
          <span className="link">
            <i className="fa fa-instagram"></i>
          </span>
        </Col>
      </Row>
    );
  }
}

export default Footer;
