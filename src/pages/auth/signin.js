import React, { Component } from 'react';
import SocialOAuth from './social-oauth';
import { auth } from '../../firebase';
import { Modal, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { showSignInModal, showSignUpModal, hideModal } from '../../redux/actions/auth';

class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      key: 1,
      email: '',
      password: '',
      showModal: true,
      validated: false,
      signinFailed: false,
      errorMessage: '',
    };
  }

  handleSubmit = async (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.setState({ validated: true });
    event.preventDefault();

    const { email, password } = this.state;

    try {
      await auth.signInWithEmailAndPassword(email, password);
      this.setState({
        email: '',
        password: '',
        showModal: false,
      });
    } catch (error) {
      this.setState({ signinFailed: true, errorMessage: error.message });
    }
  };

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  };

  openModal = () => {
    this.props.openSignInModal();
  };

  hideModal = () => {
    this.setState({
      validated: false,
    });
    this.props.hideModal();
  };

  handleFailure = (error) => {
    this.setState({
      signinFailed: true,
      errorMessage: error.errorMessage,
    });
  };

  render() {
    const { validated, signinFailed, errorMessage} = this.state;
    if (this.props.showSignInModal) {
      return (
        <Modal
          size="lg"
          className="signup-modal"
          key={this.state.key}
          centered
          show={this.openModal}
          animation={true}
          onHide={this.hideModal}
        >
          <Modal.Body className="auth-modal">
            <div>
              <h3 className="sign">Log in with</h3>
              <SocialOAuth 
                hideModal={this.hideModal} 
                onFailure={this.handleFailure}
              />
              <br />
              <h3 className="sign">or with your E-mail</h3>
            </div>
            <Form noValidate validated={validated} onSubmit={this.handleSubmit}>
              <Form.Control
                name="email"
                value={this.state.email}
                onChange={this.handleChange}
                placeholder="Email"
                required
              />
              <br />

              <Form.Control
                name="password"
                type="password"
                value={this.state.password}
                onChange={this.handleChange}
                placeholder="Password"
                required
              />
              <br />

              <div className="buttons">
                <button className="btn-main" type="submit">Log in</button>
              </div>
              {signinFailed && <div className="error">{errorMessage}</div>}
              <div className="change-modal">
                Don't have an account?
              <button className="link-main" onClick={this.props.openSignUpModal}>Sign Up</button>
            </div>
            </Form>
          </Modal.Body>
        </Modal>
      );
    } else {
      return null;
    }
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  showSignInModal: state.user.showSignInModal,
  showSignUpModal: state.user.showSignUpModal,
});

const mapDispatchToProps = (dispatch) => ({
  openSignInModal: () => dispatch(showSignInModal()),
  openSignUpModal: () => dispatch(showSignUpModal()),
  hideModal: () => dispatch(hideModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
