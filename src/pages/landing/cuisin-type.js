import React, { Component } from 'react';
import { connect } from 'react-redux';
import { history } from '../../App';

class CuisinType extends Component {

  handleCuisinTypeDetail = (type) => {
    history.push(
      `/search?keyword=&cuisineType=${type}&minprice=&maxprice=`,
    );
  }

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
            <span className="link link-main" onClick={() => this.handleCuisinTypeDetail(type)}>Learn more > </span>
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