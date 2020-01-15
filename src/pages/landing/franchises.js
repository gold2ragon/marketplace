import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import SearchFranchise from './search-franchise';

class Franchises extends Component {
  render() {
    return (
      <Container>
        <div className="landing-search is-search">
          <SearchFranchise />
        </div>
      </Container>
    );
  }
}

export default Franchises;