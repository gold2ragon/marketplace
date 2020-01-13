import React, { Component } from 'react';

class HowThisWorks extends Component {
  render() {
    const { img, title, description } = this.props;
    return (
      <div className="how-this-works">
        <div className="img">{img}</div>
        <div className="title">{title}</div>
        <div className="description">{description}</div>
      </div>
    );
  }
}

export default HowThisWorks;