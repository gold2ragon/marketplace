import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { auth } from '../../firebase';
import SignIn from '../auth/signin';
import SignUp from '../auth/signup';
import { selectCurrentUser } from '../../redux/actions/auth';
import { Navbar, NavDropdown, Nav, Container } from 'react-bootstrap';
import './landing.scss';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSignInModal: false,
      showSignUpModal: false,
      isAdminUser: false,
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
    let displayName = '';
    if (currentUser) {
      displayName = currentUser.displayName;
      if (!displayName && currentUser.firstName) {
        displayName = currentUser.firstName + ' ' + currentUser.lastName;
      }
    }
    return (
      <div className="header">
        <Container>
          <Navbar collapseOnSelect expand="lg">
            <Navbar.Brand href="/" className="logo-container">
              <div className="thebizhunt1">
                <span className="span1">TheBiz</span>
                <span className="span2">Hunt.</span>
              </div>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="mr-auto">
                {currentUser && currentUser.admin && (
                  <Nav.Link as={Link} to="/admin/listings">
                    Admin Page
                  </Nav.Link>
                )}
                <Nav.Link href="#pricing">Home</Nav.Link>
                <Nav.Link href="#pricing">Franchise</Nav.Link>
                <Nav.Link href="#pricing">About us</Nav.Link>
                {/* <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
                  <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                </NavDropdown> */}
              </Nav>
              {currentUser ? (
                <NavDropdown title={displayName || ''} id="basic-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/mypage/settings">
                    My Page
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="/" onClick={() => auth.signOut()}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav>
                  <Nav.Link onClick={this.signIn}>Log in</Nav.Link>
                  <Nav.Link className="createanaccount" onClick={this.signUp}>Create an account</Nav.Link>
                </Nav>
              )}
            </Navbar.Collapse>
          </Navbar>
        </Container>
        <hr />
        {this.state.showSignInModal && <SignIn ref={this.signInRef} />}
        {this.state.showSignUpModal && <SignUp ref={this.signUpRef} />}
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
});

export default connect(mapStateToProps)(Header);
