import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';
import { getListings } from '../../redux/actions/listing';
import { showSignInModal, showSignUpModal } from '../../redux/actions/auth';
import './listing-detail.scss';
import { auth } from '../../firebase';

class ListingDetail extends Component {
  constructor(props) {
    super(props);
    const { id } = this.props.match.params;
    this.state = {
      id,
    };
    this.galleryRef = React.createRef();
  }

  componentDidMount() {
    const { listings } = this.props;
    if (!listings) {
      this.props.getListings();
    }
  }

  renderPhotos = (photos) => {
    const items = [];
    for (const photo of photos) {
      items.push(
        <div key={Math.random()}>
          <img src={photo} alt="franchise pic" />
        </div>,
      );
    }
    return (
      <div ref={this.galleryRef} className="photo-lists">
        {items}
      </div>
    );
  };

  render() {
    const { listings } = this.props;
    if (!listings) return null;
    const { id } = this.state;
    const listing = listings[id];
    if (!listing) return null;
    return (
      <div className="listing-detail">
        <img className="img-slider" src={listing.public.photos[0]} alt="cover pic" />
        <Container>
          <Row>
            <Col lg={7}>
              <div className="cuisine-details">
                <div className="cuisine-description">{listing.public.cuisineDescription}</div>
                <div className="tag">
                  <span>{listing.public.cuisineType}</span>
                  <span>{listing.public.restaurantName}</span>
                </div>
                <div
                  className="description"
                  dangerouslySetInnerHTML={{ __html: listing.public.description }}
                />
              </div>
              {!auth.currentUser && (
                <div className="more-details">
                  <span className="label">More Details?</span>
                  <span className="link-main" onClick={this.props.openSigninModal}>
                    Login
                  </span>
                  or
                  <span className="link-main" onClick={this.props.openSignUpModal}>
                    Sign Up
                  </span>
                  to view full details
                </div>
              )}
            </Col>
            <Col lg={5}>
              <div className="franchise-info">
                <div className="label-franchise-fee">Franchise Fee</div>
                <div className="franchise-fee">$ {listing.public.franchiseFee}</div>
                <button className="btn-main">Ask a Question?</button>
                <div className="info">
                  <div className="icon-info">i</div>
                  <div className="help">
                    By clicking ask a question you will be chatting with us privately.
                  </div>
                </div>
              </div>
              <div>
                <div className="label-photo-gallery">Photo Gallery</div>
                {this.renderPhotos(listing.public.photos)}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  listings: state.admin.listings,
});

const mapDispatchToProps = (dispatch) => ({
  getListings: () => dispatch(getListings()),
  openSigninModal: () => dispatch(showSignInModal()),
  openSignUpModal: () => dispatch(showSignUpModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ListingDetail);
