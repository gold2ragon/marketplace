import React, { Component } from 'react';
import { auth } from '../firebase';
import { Container } from 'react-bootstrap';
import Header from './header';

class Homepage extends Component {
  render() {
    return (
      <div>
        <Header />
        <Container>
          <p>{ auth.currentUser ? auth.currentUser.displayName : 'Please login' }</p>
        </Container>
      </div>
    );
  }
}

export default Homepage;