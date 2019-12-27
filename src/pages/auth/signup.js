import React, { Component } from 'react';
import SocialOAuth from './social-oauth';
import { auth, createUserProfileDocument } from '../../firebase';
import { Modal, Button, Form, InputGroup, FormGroup } from 'react-bootstrap';
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
      invalid_mobile_number: false,
      invalid_code: false,
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
      invalid_message: 'Please enter a mobile number',
      showModal: true,
      showCodeInput: false,
      validated: false,
    });
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  submitPhoneNumber = async (event) => {
    event.preventDefault();
    const { mobile_number } = this.state;
    this.setState({
      invalid_mobile_number: false,
    });

    let appVerifier = window.recaptchaVerifier;
    let self = this;
    auth
      .signInWithPhoneNumber(mobile_number, appVerifier)
      .then(function(confirmationResult) {
        window.confirmationResult = confirmationResult;
        self.setState({
          showCodeInput: true,
          invalid_mobile_number: false,
        });
      })
      .catch(function(err) {
        if (err.code === 'auth/invalid-phone-number') {
          self.setState({
            invalid_mobile_number: true,
            validated: false,
            invalid_message: 'This mobile number is not valid',
          });
          return;
        } else if (err.code === 400) {
          if (err.message === "TOO_MANY_ATTEMPTS_TRY_LATER") {
            self.setState({
              invalid_mobile_number: true,
              validated: false,
              invalid_message: 'Too many attempts. Try later',
            });
            return;
          }
        }
        self.setState({
          invalid_mobile_number: true,
          validated: false,
          invalid_message: 'Some Error happend',
        });
        console.log(err);
      });
  };

  verifyCode = async () => {
    const { mobile_number, code } = this.state;
    if (!mobile_number) {
      this.setState({
        invalid_mobile_number: false,
        invalid_message: 'Please enter a mobile number.',
      });
      return false;
    }
    if (!window.confirmationResult) {
      this.setState({
        validated: false,
        invalid_mobile_number: true,
        invalid_message: 'Please verify mobile number',
      });
      return false;
    }

    try {
      const isVerifed = await window.confirmationResult.confirm(code);
      if (isVerifed) return true;
    } catch (err) {
      console.log(err);
    }
    this.setState({
      code: '',
      invalid_code: true,
      validated: false,
    });
    return false;
  };

  handleSubmit = async (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.setState({ validated: true });
    event.preventDefault();
    try {
      if (!this.verifyCode()) {
        event.stopPropagation();
        return;
      }
      const { first_name, last_name, email, password, mobile_number } = this.state;
      const { user } = await auth.createUserWithEmailAndPassword(email, password);
      await createUserProfileDocument(user, {
        first_name,
        last_name,
        mobile_number,
      });
    } catch (error) {
      console.log(error);
    }
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
        showCodeInput,
        validated,
        invalid_code,
        invalid_mobile_number,
        invalid_message,
      } = this.state;
      console.log(invalid_code, invalid_mobile_number, invalid_message, validated);
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
            <div>
              <h3 className="sign">Sign in with</h3>
              <SocialOAuth hideModal={this.hideModal} />
              <br />
            </div>
            <Form noValidate validated={validated} onSubmit={this.handleSubmit}>
              <FormGroup>
                <Form.Control
                  required
                  type="text"
                  name="first_name"
                  placeholder="First Name"
                  value={first_name}
                  onChange={this.handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Form.Control
                  type="text"
                  name="last_name"
                  value={last_name}
                  onChange={this.handleChange}
                  placeholder="Last Name"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Form.Control
                  type="email"
                  name="email"
                  value={email}
                  onChange={this.handleChange}
                  placeholder="Email"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Form.Control
                  type="password"
                  name="password"
                  value={password}
                  onChange={this.handleChange}
                  placeholder="Password"
                  required
                />
              </FormGroup>
              <Form.Group className="form-input-mobile">
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
                  {invalid_mobile_number && (
                    <Form.Control.Feedback type="invalid">{invalid_message}</Form.Control.Feedback>
                  )}
                </InputGroup>
              </Form.Group>
              {showCodeInput && (
                <FormGroup className="form-input-mobile">
                  <Form.Control
                    type="text"
                    name="code"
                    value={code}
                    onChange={this.handleChange}
                    placeholder="6 digit verification code"
                    required
                  />
                  {invalid_code && (
                    <Form.Control.Feedback type="invalid">
                      Code is not correct.
                    </Form.Control.Feedback>
                  )}
                </FormGroup>
              )}
              <Button variant="secondary" type="submit">
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
