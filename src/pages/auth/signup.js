import React, { Component } from 'react';
import SocialOAuth from './social-oauth';
import { auth, createUserProfileDocument } from '../../firebase';
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';
import firebase from 'firebase/app';

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      key: 1,
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      mobile_number: '',
      code: '',
      invalid_message: '',
      showModal: true,
      showCodeInput: false,
      validated: false,
    };
  }

  componentDidMount() {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('invisible-recapture', {
      size: 'invisible',
      callback: function(response) {},
    });
    this.clearFormValues();
  }

  openModal = () => {
    this.setState({
      key: Math.random(),
      showModal: true,
    });
  };

  hideModal = () => {
    this.setState({ showModal: false });
  };

  clearFormValues = () => {
    this.setState({
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      mobile_number: '',
      code: '',
      code_invalid: true,
      invalid_message: '',
      showModal: true,
      showCodeInput: false,
      validated: false,
    });
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      return;
    }

    try {
      if (!this.verifyCode()) {
        this.setState({ code: '' });
        return;
      }
      const { email, password } = this.state;
      const { user } = await auth.createUserWithEmailAndPassword(email, password);
      await createUserProfileDocument(user, this.state);
      this.setState({ validated: true });

    } catch (error) {
      console.log(error);
    }
  };

  submitPhoneNumber = async (event) => {
    event.preventDefault();
    console.log('verification code sent!');

    const { mobile_number } = this.state;

    let appVerifier = window.recaptchaVerifier;
    let that = this;
    auth
      .signInWithPhoneNumber(mobile_number, appVerifier)
      .then(function(confirmationResult) {
        window.confirmationResult = confirmationResult;
        that.setState({ showCodeInput: true });
      })
      .catch(function(err) {
        let invalid_message = 'The code is not correct.';
        if (err.code === "auth/invalid-phone-number") {
          invalid_message = 'The phone number is not valid';
        }
        that.setState({ code: '' });
      });
  };

  verifyCode = async () => {
    const { code } = this.state;

    window.confirmationResult
      .confirm(code)
      .then(function(result) {
        return true;
      })
      .catch(function(err) {
        return false;
      });
  };

  render() {
    const { showModal } = this.state;
    if (this.state.showModal) {
      const {
        first_name,
        last_name,
        email,
        password,
        phoneNumber,
        code,
        code_invalid,
        validated,
        invalid_message,
      } = this.state;
      return (
        <Modal
          key={this.state.key}
          size="lg"
          centered
          show={showModal}
          animation={true}
          onHide={this.hideModal}
        >
          <Modal.Body className="auth-modal">
            <h1 className="sign">Sign in with</h1>
            <SocialOAuth hideModal={this.hideModal} />
            <h1 className="sign">or Sign up</h1>
            <Form noValidate validated={validated} onSubmit={this.handleSubmit}>
              <Form.Control
                type="text"
                name="first_name"
                value={first_name}
                onChange={this.handleChange}
                placeholder="First Name"
                required
              />
              <Form.Control
                type="text"
                name="last_name"
                value={last_name}
                onChange={this.handleChange}
                placeholder="Last Name"
                required
              />
              <Form.Control
                type="email"
                name="email"
                value={email}
                onChange={this.handleChange}
                placeholder="Email"
                required
              />
              <Form.Control
                type="password"
                name="password"
                value={password}
                onChange={this.handleChange}
                placeholder="Password"
                required
              />
              <InputGroup>
                <Form.Control
                  type="tel"
                  name="mobile_number"
                  value={phoneNumber}
                  onChange={this.handleChange}
                  placeholder="Mobile Number"
                  required
                />
                <InputGroup.Append>
                  <InputGroup.Text>
                    <a className="btn-addon" onClick={this.submitPhoneNumber}>
                      Verify
                    </a>
                  </InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
              {this.state.showCodeInput && (
                <div>
                  <Form.Control
                    type="text"
                    name="code"
                    value={code}
                    onChange={this.handleChange}
                    placeholder="6 digit verification code"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {invalid_message}
                  </Form.Control.Feedback>
                </div>
              )}
              <Button variant="secondary" className="form-control" type="submit">
                Sign up
              </Button>
              <div className="hidden" id="invisible-recapture" />
            </Form>
          </Modal.Body>
        </Modal>
      );
    } else {
      return null;
    }
  }
}

export default SignUp;
