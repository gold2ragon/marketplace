import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import SearchFranchise from './search-franchise';
import numeral from 'numeral';
import { history } from '../../App';

import './franchises.scss';

class Franchises extends Component {

  handleListingDetail = (id) => {
    history.push(`/listing/${id}`);
  }

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
              <div>
                <div className="cuisine-description">
                  {listing.public.cuisineDescription}
                </div>
                <div className="description" dangerouslySetInnerHTML={{__html: listing.public.description}} />
              </div>
              <div>
                <div className="label-franchise-fee">Franchise Fee</div>
                <div className="franchise-fee">S${numeral(listing.public.franchiseFee).format('0,0')}</div>
                <div className="footer">
                  <div className="tag">
                    <span>{listing.public.cuisineType}</span>
                    <span>{listing.public.restaurantName}</span>
                  </div>
                  <span className="link-main" onClick={() => this.handleListingDetail(listing.id)}>Learn more ></span>
                </div>
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
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  searchResults: state.user.searchResults,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Franchises);
