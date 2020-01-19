import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';
import { getListings } from '../../redux/actions/listing';
import { showSignInModal, showSignUpModal } from '../../redux/actions/auth';
import './listing-detail.scss';
import { auth } from '../../firebase';
import _ from 'lodash';
import numeral from 'numeral';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

class ListingDetail extends Component {
  constructor(props) {
    super(props);
    const { id } = this.props.match.params;
    this.state = {
      id,
      showPhotosGallery: false,
      imageIndex: 0,
    };
    this.galleryRef = React.createRef();
  }

  componentDidMount() {
    const { listings } = this.props;
    if (!listings) {
      this.props.getListings();
    }
    window.scrollTo(0, 0);
  }

  renderPhotos = (photos) => {
    const items = [];
    _.map(photos, (photo, index) => {
      items.push(
        <div key={Math.random()}>
          <img src={photo} alt="franchise pic" onClick={() => this.openPhotosGallery(index)} />
        </div>,
      );
    });
    return (
      <div className="photo-lists">
        {items}
      </div>
    );
  };

  openPhotosGallery = (index) => {
    this.setState({
      showPhotosGallery: true,
      imageIndex: index,
    })
  }

  onHide = () => {
    this.setState({ showPhotosGallery: false });
  }

  render() {
    const { listings } = this.props;
    if (!listings) return null;
    const { id, showPhotosGallery, imageIndex } = this.state;
    const listing = listings[id];
    if (!listing) return null;
    const images = listing.public.photos;

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
                {auth.currentUser && (
                  <Fragment>
                    <br />
                    <h1>Private Information</h1>
                    <div
                      className="description"
                      dangerouslySetInnerHTML={{ __html: listing.private.details }}
                    />
                  </Fragment>
                )}
              </div>
            </Col>
            <Col lg={5}>
              <div>
                <div className="label-photo-gallery">Photo Gallery</div>
                {this.renderPhotos(listing.public.photos)}
              </div>
              <div className="franchise-info">
                <div className="label-franchise-fee">Franchise Fee</div>
                <div className="franchise-fee">S${numeral(listing.public.franchiseFee).format('0,0')}</div>
                <a href="mailto:hello@thebizhunt.com" className="btn-main">Ask a Question?</a>
                <div className="info">
                  <div className="icon-info">i</div>
                  <div className="help">
                    By clicking Ask a Question you will be chatting with us privately.
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              {!auth.currentUser && (
                <div className="more-details">
                  <div className="label">More Details?</div>
                  <div>
                    <span className="link-main" onClick={this.props.openSigninModal}>
                      Login
                    </span>
                    or 
                    <span className="link-main" onClick={this.props.openSignUpModal}>
                      Sign Up
                    </span>
                    to view full details
                  </div>
                </div>
              )}
            </Col>
          </Row>
        </Container>
        {showPhotosGallery && (
          <Lightbox
            mainSrc={images[imageIndex]}
            nextSrc={images[(imageIndex + 1) % images.length]}
            prevSrc={images[(imageIndex + images.length - 1) % images.length]}
            onCloseRequest={() => this.setState({ showPhotosGallery: false })}
            onMovePrevRequest={() =>
              this.setState({
                imageIndex: (imageIndex + images.length - 1) % images.length,
              })
            }
            onMoveNextRequest={() =>
              this.setState({
                imageIndex: (imageIndex + 1) % images.length,
              })
            }
          />
        )}
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
