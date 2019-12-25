import React, { Component } from 'react';
import { auth } from '../firebase';

class Homepage extends Component {
  render() {
    return (
      <div>
        <p>{ auth.currentUser ? auth.currentUser.displayName : 'Please login' }</p>
      </div>
    );
  }
}

export default Homepage;