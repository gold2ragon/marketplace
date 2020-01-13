import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { auth } from '../../firebase';
import SignIn from '../auth/signin';
import SignUp from '../auth/signup';
import { selectCurrentUser } from '../../redux/actions/auth';
import { Navbar, NavDropdown, Nav, Container, Form, FormControl, Button } from 'react-bootstrap';
import SearchFranchises from './search-franchise';
import './landing.scss';

const User = (currentUser) => {
  let { firstName, displayName, avatarURL } = currentUser.user;
  if (!firstName) firstName = displayName.split(' ')[0];
  return (
    <span>
      Hi, {firstName} &nbsp;
      <img src={avatarURL ? avatarURL : require('../../assets/user.png')} />
    </span>
  )
};

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

  renderDefaultHeader = () => {
    return (
      <Fragment>
        <Nav.Link href="#pricing">Home</Nav.Link>
        <Nav.Link href="#pricing">Franchise</Nav.Link>
        <Nav.Link href="#pricing">About us</Nav.Link>
      </Fragment>
    )
  }

  renderSearchHeader = () => {
    return (
      // <Form inline>
      //   {/* <SearchFranchises className="nav-link"/> */}
      //   <FormControl type="text" placeholder="Search" className="mr-sm-2" />
      //   <Button variant="outline-success">Search</Button>
      // </Form>
      <SearchFranchises />
    )
  }

  render() {
    const { currentUser, isSearch } = this.props;
    let displayName = '';
    if (currentUser) {
      displayName = currentUser.firstName;
    }
    return (
      <div className="header">
        <Container>
          <Navbar collapseOnSelect expand="lg">
            <Navbar.Brand as={Link} to="/" className="logo-container">
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
                { isSearch ? this.renderSearchHeader() : this.renderDefaultHeader() }
              </Nav>
              {currentUser ? (
                <NavDropdown title={<User user={currentUser}/> || ''} id="basic-nav-dropdown">
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