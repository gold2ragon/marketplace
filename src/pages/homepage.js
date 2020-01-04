import React, { Component } from 'react';
import { auth } from '../firebase';
import { Container } from 'react-bootstrap';

class Homepage extends Component {
  render() {
    return (
      <Container>
        <p>{ auth.currentUser ? auth.currentUser.displayName : 'Please login' }</p>
      </Container>
    );
  }
}

export default Homepage;