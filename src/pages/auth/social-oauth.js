import React, { Component } from 'react';
import { signInWithGoogle, signInWithFacebook } from '../../firebase';
import './auth.scss';

class SocialOAuth extends Component {
  
  signInWithFacebook = () => {
    this.props.hideModal();
    signInWithFacebook();
  }

  signInWithLinkedIn = () => {
    this.props.hideModal();
  }

  signInWithGoogle = () => {
    this.props.hideModal();
    signInWithGoogle();
  }

  render() {
    return (
      <div>
        <button className="oauth-button" onClick={this.signInWithFacebook}>
          <img src={require('../../assets/facebook.png')} alt="facebook icon" />
        </button>
        <button className="oauth-button" onClick={this.signInWithLinkedIn}>
          <img src={require('../../assets/linkedin.png')} alt="linkedin icon" />
        </button>
        <button className="oauth-button" onClick={this.signInWithGoogle}>
          <img src={require('../../assets/google.png')} alt="google icon" />
        </button>
      </div>
    );
  }
}

export default SocialOAuth;
