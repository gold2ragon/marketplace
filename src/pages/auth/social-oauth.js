import React, { Component } from 'react';
import { signInWithGoogle, signInWithFacebook } from '../../firebase';
import LinkedIn from './linkedin/LinkedIn';
import { auth } from '../../firebase';
import './auth.scss';

class SocialOAuth extends Component {

  handleSuccess = async (data) => {
    const { token } = data;
    try {
      await auth.signInWithCustomToken(token);
    } catch (error) {
      this.props.onFailure(error);
    }
    this.props.hideModal();
  }

  handleFailure = (error) => {
    this.props.onFailure(error);
  }

  signInWithFacebook = () => {
    try {
      signInWithFacebook().then(() => {
        this.props.hideModal();
      });
    } catch (error) {
      this.props.onFailure(error);
    }
  }

  signInWithGoogle = () => {
    try {
      signInWithGoogle().then(() => {
        this.props.hideModal();
      });
    } catch (error) {
      this.props.onFailure(error);
    }
  }

  render() {
    const clientId = process.env.REACT_APP_LINKEDIN_CLIENT_ID;
    return (
      <div className="social-oauth-div">
        <button className="oauth-button google" onClick={this.signInWithGoogle}>
          <img src={require('../../assets/google.png')} alt="google icon" />
        </button>
        <button className="oauth-button facebook" onClick={this.signInWithFacebook}>
          <img src={require('../../assets/facebook.png')} alt="facebook icon" />
        </button>
        <LinkedIn
          className="oauth-button linkedin"
          clientId={clientId}
          onFailure={this.handleFailure}
          onSuccess={this.handleSuccess}
          redirectUri={process.env.REACT_APP_LINKEDIN_REDIRECT_URI}
          scope="r_liteprofile r_emailaddress"
        >
          <img src={require('../../assets/linkedin.png')} alt="Log in with Linked In" />
        </LinkedIn>
      </div>
    );
  }
}

export default SocialOAuth;
