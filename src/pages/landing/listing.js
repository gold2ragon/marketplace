import React, { Component } from 'react';

class Listing extends Component {
  render() {
    const { listing } = this.props;
    const content = listing.public;
    return (
      <div className="listing">
        <img src={content.photos[0]} alt="listing"/>
        <div>
          <div className="title">{content.restaurantName}</div>
          <div className="description">{content.cuisineDescription}</div>
          <div className="franchiseFee">$ {parseFloat(content.franchiseFee)/1000}K</div>
          <div className="learn-more">
            <a className="link-main">Learn more > </a>
          </div>
        </div>
      </div>
    );
  }
}

export default Listing;