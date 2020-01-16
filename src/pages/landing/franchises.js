import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
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