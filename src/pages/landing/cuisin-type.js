import React, { Component } from 'react';
import { connect } from 'react-redux';

class CuisinType extends Component {
  render() {
    const { cuisineTypes, type } = this.props;
    if (!cuisineTypes) return null;
    const cuisineType = cuisineTypes[type];
    if (!cuisineType) return null;
    return (
      <div className="cuisine-type">
        <img src={cuisineType.url} alt="cuisine type" />
        <div>
          <div className="type">
            {type}
          </div>
          <div className="count">{cuisineType.count} Franchise</div>
          <div className="learn-more">
            <button className="link-main">Learn more > </button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  cuisineTypes: state.admin.cuisineTypes
});

export default connect(mapStateToProps)(CuisinType);