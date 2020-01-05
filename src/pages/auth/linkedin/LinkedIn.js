import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class LinkedIn extends Component {
  static propTypes = {
    className: PropTypes.string,
    onFailure: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    clientId: PropTypes.string.isRequired,
    redirectUri: PropTypes.string.isRequired,
    renderElement: PropTypes.func,
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.receiveMessage, false);
    if (this.popup && !this.popup.closed) this.popup.close();
  }

  getUrl = () => {
    const { redirectUri, clientId, state, scope, supportIE, redirectPath } = this.props;
    // TODO: Support IE 11
    const scopeParam = (scope) ? `&scope=${supportIE ? scope : encodeURI(scope)}` : '';
    const linkedInAuthenLink = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}${scopeParam}&state=${state}`;
    if (supportIE) {
      const redirectLink = `${window.location.origin}${redirectPath}?linkedin_redirect_url=${encodeURIComponent(linkedInAuthenLink)}`;
      return redirectLink;
    }
    return linkedInAuthenLink;
  }

  receiveMessage = async (event) => {
    const { state } = this.props;
    if (event.origin === window.location.origin) {
      if (event.data.errorMessage && event.data.from === 'Linked In') {
        // Prevent CSRF attack by testing state
        if (event.data.state !== state) {
          this.popup && this.popup.close();
          return;
        }
        this.props.onFailure(event.data);
        this.popup && this.popup.close();
      } else if (event.data.code && event.data.from === 'Linked In') {
        // Prevent CSRF attack by testing state
        if (event.data.state !== state) {
          this.popup && this.popup.close();
          return;
        }
        
        const { code } = event.data;
        const clientId = process.env.REACT_APP_LINKEDIN_CLIENT_ID;
        const clientSecret = process.env.REACT_APP_LINKEDIN_SECREST;
        const redirectUri = process.env.REACT_APP_LINKEDIN_REDIRECT_URI;

        // Get access token from code.
        const CORS_URL = 'https://cors-anywhere.herokuapp.com/';
        const url = CORS_URL + `https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=${code}&redirect_uri=${redirectUri}&client_id=${clientId}&client_secret=${clientSecret}`;
        const fetchToken = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        });
        const { access_token: accessToken } = await fetchToken.json();

        // Get profile info
        const fetchProfile = await fetch(CORS_URL + 'https://api.linkedin.com/v2/me', {
          headers: {
            'Connection': 'keep-alive',
            'Authorization': `Bearer ${accessToken}`
          }
        })
        const userResults = await fetchProfile.json();

        // Get email
        const fetchEmail = await fetch(CORS_URL + 'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
          headers: {
            'Connection': 'keep-alive',
            'Authorization': `Bearer ${accessToken}`
          }
        })
        const emailResults = await fetchEmail.json();

        const linkedInUserID = userResults.id;
        const firstName = userResults.localizedFirstName;
        const lastName = userResults.localizedLastName;
        const email = emailResults.elements && emailResults.elements[0] && emailResults.elements[0]['handle~'] ? emailResults.elements[0]['handle~'].emailAddress : '';
        const projectID = process.env.REACT_APP_FIREBASE_AUTH_DOMAIN.split('.')[0];

        const fetchFirebaseToken = await fetch(
          CORS_URL + `https://us-central1-${projectID}.cloudfunctions.net/getCredential`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              linkedinID: linkedInUserID,
              firstName,
              lastName,
              email,
              accessToken,
            })
          }
        );
        const firebaseToken = await fetchFirebaseToken.json();
        if (firebaseToken.code) {
          this.props.onFailure({ errorMessage: firebaseToken.message });
        } else {
          this.props.onSuccess({ token: firebaseToken.token });
        }
        this.popup && this.popup.close();
      }
    }
  };

  handleConnectLinkedInClick = (e) => {
    if (e) {
      e.preventDefault();
    }
    this.props.onClick && this.props.onClick();
    this.popup = window.open(this.getUrl(), '_blank', 'width=600,height=600');
    window.removeEventListener('message', this.receiveMessage, false);
    window.addEventListener('message', this.receiveMessage, false);
  }


  render() {
    const { className, disabled, children, renderElement } = this.props;
    if (renderElement) {
      return renderElement({ onClick: this.handleConnectLinkedInClick, disabled })
    }
    return (
      <button
        type="button"
        onClick={this.handleConnectLinkedInClick}
        className={className}
        disabled={disabled}
      >
        {children}
      </button>

    );
  }
}

LinkedIn.defaultProps = {
  disabled: false,
  state: 'fdsf78fyds7fm',
  supportIE: false,
  redirectPath: '/linkedin'
};
export default LinkedIn;
