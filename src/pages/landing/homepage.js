import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';
import { getListings, getFeaturedFranchises } from '../../redux/actions/listing';
import { showSignInModal, showSignUpModal } from '../../redux/actions/auth';
import SearchFranchise from './search-franchise';
import Listing from './listing';
import CuisineType from './cuisin-type';
import HowThisWorks from './how-this-works';
import _ from 'lodash';
import { history } from '../../App';

class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchKeyword: '',
      cuisineType: 'Cuisine Type',
      minprice: '',
      maxprice: '',
      selectedInput: 'minprice',
      priceRangeInfo: 'Franchise Fee',
    };
    this.minpriceRef = React.createRef();
    this.maxpriceRef = React.createRef();
    this.priceRangeRef = React.createRef();
  }

  componentDidMount() {
    this.props.getListings();
    this.props.getFeaturedFranchises();
  }

  handleSeeAllFranchises = () => {
    history.push(`/search?keyword=&cuisineType=${'Cuisine Type'}&minprice=&maxprice=`);
  };

  render() {
    const { featuredFranchises, cuisineTypes } = this.props;
    if (!featuredFranchises) return null;
    const listingKeys = Object.keys(featuredFranchises);
    const cuisineTypesKeys = Object.keys(cuisineTypes);
    let columnWidth = 12 / cuisineTypesKeys.length;
    if (columnWidth > 5) columnWidth = 4;
    return (
      <Fragment>
        <div className="background">
          <Container>
            <img className="food1" src={require('../../assets/img/food1.png')} alt="food png" />
            <img className="food2" src={require('../../assets/img/food2.png')} alt="food png" />
            <img className="food3" src={require('../../assets/img/food3.png')} alt="food png" />
            <img className="food4" src={require('../../assets/img/food4.png')} alt="food png" />
            <img className="food5" src={require('../../assets/img/food5.png')} alt="food png" />
            <img className="food6" src={require('../../assets/img/food6.png')} alt="food png" />
            <img className="food7" src={require('../../assets/img/food7.png')} alt="food png" />
            <img className="food8" src={require('../../assets/img/food8.png')} alt="food png" />
          </Container>
        </div>
        <div className="thefinestfoodsfra">
          <span className="span1">The finest </span>
          <span className="span2">food franchises </span>
          <span className="span3">
            are <br /> ready to work with you
          </span>
        </div>
        <Container className="landing-search">
          <SearchFranchise />
        </Container>
        <section id="featured">
          <Container>
            <Row>
              <Col lg={4} md={12} sm={12}>
                <div className="featured-fanchise">
                  <div>Featured</div>
                  <div>Franchises</div>
                </div>
                <span className="link link-main" onClick={this.handleSeeAllFranchises}>
                  See all franchises
                </span>
              </Col>
              <Col lg={4} md={6} sm={6}>
                {listingKeys && listingKeys.length > 0 && (
                  <Listing id={listingKeys[0]} listing={featuredFranchises[listingKeys[0]]} />
                )}
              </Col>
              <Col lg={4} md={6} sm={6}>
                {listingKeys && listingKeys.length > 1 && (
                  <Listing id={listingKeys[1]} listing={featuredFranchises[listingKeys[1]]} />
                )}
              </Col>
            </Row>
          </Container>
        </section>
        <Container>
          <section id="explore-cuisine-types">
            <div className="title">Explore TheBizHunt Cuisine Types</div>
            <div className="info">
              <div>Discover the best franchises available</div>
              <span className="link link-main" onClick={this.handleSeeAllFranchises}>
                See all franchises
              </span>
            </div>
            <Row>
              {_.map(cuisineTypesKeys, (key, index) => (
                <Col key={index} md={columnWidth}>
                  <CuisineType type={key} />
                </Col>
              ))}
            </Row>
            <hr />
          </section>
          <section id="how-this-works">
            <div className="title">How This Works</div>
            <Row>
              <Col lg={4} md={12}>
                <HowThisWorks
                  img="🙋‍♂️"
                  title={
                    <span>
                      Interested in setting up
                      <br />a franchise?
                    </span>
                  }
                  description="All franchises are handpicked by our team and we will guide you through the process of buying and setting up the franchise."
                />
              </Col>
              <Col lg={4} md={12}>
                <HowThisWorks
                  img="👔"
                  title={`For F&B Business Owners`}
                  description={
                    <span>
                      Interested in franchising your business? We guide first-time franchisors
                      through the process. Sign up for an account or contact us at
                      <b> hello@thebizhunt.com</b>
                    </span>
                  }
                />
              </Col>
              <Col lg={4} md={12}>
                <HowThisWorks
                  img="🤝"
                  title="Refer a Franchise to us"
                  description={`
                      Know someone that might be interested in buying a franchise? 
                      Sign up for an account and send us their contact details. 
                      Receive a referral fee when they open a franchise
                    `}
                />
              </Col>
            </Row>
          </section>
        </Container>
        <section id="intersted">
          <Container>
            <Row>
              <Col md={6}>
                <img src={require('../../assets/img/food9.png')} alt="pic"></img>
              </Col>
              <Col md={6}>
                <div className="title">
                  Interested to Work
                  <br />
                  With Us?
                </div>
                <div className="description">
                  Sign up to find out more about the franchises available,
                  <br />
                  or refer someone who may be interested!
                </div>
                <a href="mailto:hello@thebizhunt.com" className="btn-main btn-contact-us">
                  Contact Us
                </a>
              </Col>
            </Row>
          </Container>
        </section>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  listings: state.admin.listings,
  featuredFranchises: state.admin.featuredFranchises,
  cuisineTypes: state.admin.cuisineTypes,
});

const mapDispatchToProps = (dispatch) => ({
  getListings: () => dispatch(getListings()),
  getFeaturedFranchises: () => dispatch(getFeaturedFranchises()),
  openSigninModal: () => dispatch(showSignInModal()),
  openSignUpModal: () => dispatch(showSignUpModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Homepage);
