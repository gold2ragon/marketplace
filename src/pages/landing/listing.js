import React, { Component } from 'react';
import { history } from '../../App';
import numeral from 'numeral';

class Listing extends Component {

  handleListingDetail = () => {
    history.push(`/listing/${this.props.id}`);
  }

  render() {
    const { listing } = this.props;
    const content = listing.public;
    return (
      <div className="listing">
        <img src={content.photos[0]} alt="listing"/>
        <div>
          <div>
            <div className="title">{content.restaurantName}</div>
            <div className="description">{content.cuisineDescription}</div>
          </div>
          <div>
            <div className="franchiseFee">S${numeral(content.franchiseFee).format('0,0')}</div>
            <span className="learn-more">
              <span className="link link-main" onClick={this.handleListingDetail}>Learn more > </span>
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default Listing;