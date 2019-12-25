import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { auth } from '../firebase';
import SignIn from './auth/signin';
import SignUp from './auth/signup';
import { selectCurrentUser } from '../redux/actions/auth';
import { ReactComponent as Logo } from '../assets/logo.svg';
import Button from '../components/button';

import './header.scss';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSignInModal: false,
      showSignUpModal: false,
    };

    this.signInRef = React.createRef();
    this.signUpRef = React.createRef();
  }

  signUp = () => {
    this.setState({
      showSignUpModal: true,
      showSignInModal: false,
    });
    if (this.signUpRef.current) {
      console.log('====1', this.signUpRef);
      this.signUpRef.current.openModal();
    }
  };

  signIn = () => {
    this.setState({
      showSignUpModal: false,
      showSignInModal: true,
    });
    if (this.signInRef.current) {
      this.signInRef.current.openModal();
    }
  };

  render() {
    const { currentUser } = this.props;
    return (
      <Fragment>
        <div className="header">
          <Link className="logo-container" to="/">
            <Logo className="logo" />
          </Link>
          <div className="options">
            {currentUser ? (
              <Button onClick={() => auth.signOut()}>
                Log out
              </Button>
            ) : (
              <Fragment>
                <Button onClick={this.signUp}>New User? Register</Button>
                <Button onClick={this.signIn}>Login</Button>
              </Fragment>
            )}
          </div>
        </div>
        {this.state.showSignInModal && <SignIn ref={this.signInRef}/>}
        {this.state.showSignUpModal && <SignUp ref={this.signUpRef}/>}
      </Fragment>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
});

export default connect(mapStateToProps)(Header);