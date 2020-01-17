import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
// import { createStructuredSelector } from 'reselect';
import { auth } from '../../firebase';
import SignIn from '../auth/signin';
import SignUp from '../auth/signup';
import { showSignInModal, showSignUpModal } from '../../redux/actions/auth';
// import { selectCurrentUser } from '../../redux/actions/auth';
import { Navbar, NavDropdown, Nav, Container } from 'react-bootstrap';
import SearchFranchises from './search-franchise';
import './landing.scss';

const User = ({ user }) => {
  if (!user) return null;
  let { firstName, displayName, avatarURL } = user;
  if (!displayName) return null;
  if (!firstName) firstName = displayName.split(' ')[0];
  return (
    <span>
      Hi, {firstName} &nbsp;
      <img src={avatarURL ? avatarURL : require('../../assets/user.png')} alt="user avatar" />
    </span>
  )
};

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // showSignInModal: false,
      // showSignUpModal: false,
      isAdminUser: false,
      isMobile: false,
    };

    this.signInRef = React.createRef();
    this.signUpRef = React.createRef();
  }

  componentDidMount() {
    const windowWidth = window.innerWidth;
    this.setState({ isMobile: windowWidth < (this.props.isSearch ? 1024: 992) });
  }

  signUp = () => {
    // this.setState({
    //   showSignUpModal: true,
    //   showSignInModal: false,
    // });
    this.props.showSignUpModal();
    if (this.signUpRef.current) {
      this.signUpRef.current.openModal();
    }
  };

  signIn = () => {
    // this.setState({
    //   showSignUpModal: false,
    //   showSignInModal: true,
    // });
    this.props.showSignInModal();
    // if (this.signInRef.current) {
    //   this.signInRef.current.openModal();
    // }
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
      <SearchFranchises />
    )
  }

  render() {
    const { currentUser } = this.props;
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
                {this.renderDefaultHeader()}
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
        {this.props.showSignInModal && <SignIn ref={this.signInRef} />}
        {this.props.showSignUpModal && <SignUp ref={this.signUpRef} />}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  showSignInModal: state.user.showSignInModal,
  showSignUpModal: state.user.showSignUpModal,
});

const mapDispatchToProps = (dispatch) => ({
  showSignInModal: () => dispatch(showSignInModal()),
  showSignUpModal: () => dispatch(showSignUpModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
