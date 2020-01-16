import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import SearchFranchise from './search-franchise';
import Footer from './footer';
import './franchises.scss';

class Franchises extends Component {
  renderListings = () => {
    const { searchResults } = this.props;
    if (!searchResults) return null;
    const listings = [];
    for (const listing of searchResults) {
      listings.push(
        <div key={Math.random()} className="search-list">
          <Row>
            <Col md="6">
              <img src={listing.public.photos[0]} alt="pic of listing"/>
            </Col>
            <Col md="6">
              <div className="cuisine-description">
                {listing.public.cuisineDescription}
              </div>
              <div className="description" dangerouslySetInnerHTML={{__html: listing.public.description}} />
              <div className="label-franchise-fee">Franchise Fee</div>
              <div className="franchise-fee">$ {listing.public.franchiseFee}</div>
              <div className="tag">
                <span>{listing.public.cuisineType}</span>
                <span>{listing.public.restaurantName}</span>
              </div>
            </Col>
          </Row>
        </div>
      );
    }
    return <div>{listings}</div>;
  };

  render() {
    const { searchResults } = this.props;
    return (
      <Container>
        <div className="landing-search is-search">
          <SearchFranchise />
          {searchResults && (
            <div className="search-results-count">
              {`${searchResults.length} Franchise${searchResults.length > 1 ? 's' : ''} found`}
            </div>
          )}
          {this.renderListings()}
        </div>
        <Footer />
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  searchResults: state.user.searchResults,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Franchises);
