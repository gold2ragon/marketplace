import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';
import { getListings } from '../../redux/actions/listing';
import SearchFranchise from './search-franchise';
import Listing from './listing';
import CuisineType from './cuisin-type';
import HowThisWorks from './how-this-works';
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
  }

  handleSeeAllFranchises = () => {
    history.push(
      `/search?keyword=&cuisineType=${'Cuisine Type'}&minprice=&maxprice=`,
    );
  }

  render() {
    const { listings } = this.props;
    if (!listings) return null;
    const listingKeys = Object.keys(listings);

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
                  <span role="img" aria-labelledby="star">🌟</span>
                  <div>Featured</div>
                  <div>Franchise</div>
                </div>
                <span className="link link-main" onClick={this.handleSeeAllFranchises}>
                  See all franchises
                </span>
              </Col>
              <Col lg={4} md={6} sm={6}>
                {(listingKeys && listingKeys.length > 0) && <Listing id={listingKeys[0]} listing={listings[listingKeys[0]]} />}
              </Col>
              <Col lg={4} md={6} sm={6}>
                {(listingKeys && listingKeys.length > 1) && <Listing id={listingKeys[1]} listing={listings[listingKeys[1]]} />}
              </Col>
            </Row>
          </Container>
        </section>
        <Container>
          <section id="explore-cuisine-types">
            <div className="title">
              Explore TheBizHunt Cuisine Types
              </div>
            <div className="info">
              <span>Discover the best franchises available</span>
              <span className="link link-main">
                See all franchises
              </span>
            </div>
            <Row>
              <Col lg={3} md={6}>
                <CuisineType type="Singaporean" />
              </Col>
              <Col lg={3} md={6}>
                <CuisineType type="Chinese" />
              </Col>
              <Col lg={3} md={6}>
                <CuisineType type="Japanese" />
              </Col>
              <Col lg={3} md={6}>
                <CuisineType type="Halal/Vegetarian" />
              </Col>
            </Row>
            <hr />
          </section>
          <section id="how-this-works">
            <div className="title">
              How This Works
              </div>
            <Row>
              <Col lg={4} md={12}>
                <HowThisWorks
                  img="🙋‍♂️"
                  title={<span>Interested in setting up<br />a franchise?</span>}
                  description="All franchises are handpicked by our team and we will guide you through the process of buying and setting up the franchise."
                />
              </Col>
              <Col lg={4} md={12}>
                <HowThisWorks
                  img="👔"
                  title={`For F&B Business Owners`}
                  description={`
                      Interested in franchising your business? 
                      We guide first-time franchisors through the process. 
                      Sign up for an account or contact us at hello@thebizhunt.com
                    `}
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
                <div className="title">Interested to Work<br />With Us?</div>
                <div className="description">
                  Sign up to find out more about the franchises available,<br />
                  or refer someone who may be interested!
                </div>
                <button className="btn-main">Create your account</button>
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
});

const mapDispatchToProps = (dispatch) => ({
  getListings: () => dispatch(getListings()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Homepage);