import React, { Component } from 'react';
import SocialOAuth from './social-oauth';
import { auth, createUserProfileDocument } from '../../firebase';
import { Modal, Button, Form, InputGroup, FormGroup } from 'react-bootstrap';
import firebase from 'firebase/app';

import { validE164 } from '../../utils';

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      key: 1,
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      mobileNumber: '',
      code: '',
      invalidMobileNumber: false,
      invalidCode: false,
      showModal: true,
      showCodeInput: false,
      validated: false,
      verificationId: '',
    };
  }

  componentDidMount() {
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
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      mobileNumber: '',
      code: '',
      codeInvalid: true,
      invalidMessage: 'Please enter a mobile number',
      showModal: true,
      showCodeInput: false,
      validated: false,
      verified: false,
    });
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  submitPhoneNumber = async (event) => {
    event.preventDefault();
    const { mobile_number } = this.state;
    let applicationVerifier = new firebase.auth.RecaptchaVerifier('invisible-recapture', {
      size: 'invisible',
    });
    let provider = new firebase.auth.PhoneAuthProvider();

    try {
      const verificationId = await provider.verifyPhoneNumber(mobile_number, applicationVerifier);
      this.setState({
        showCodeInput: true,
        verificationId,
      });
    } catch (error) {
      if (error.code === 'auth/invalid-phone-number') {
        this.setState({
          validated: false,
          invalid_mobile_number: true,
          invalid_message: 'Please enter a valid mobile number',
        });
      } else if (error.code === 'auth/missing-phone-number') {
        this.setState({
          validated: false,
          invalid_mobile_number: true,
          invalid_message: 'Please enter mobile number',
        });
      } else {
        this.setState({
          validated: false,
          invalid_mobile_number: true,
          invalid_message: 'An error occured',
        });
      }
    }
  };

  verifyCode = async () => {
    const { mobile_number, code, verificationId } = this.state;
    if (!validE164(mobile_number)) {
      this.setState({
        invalid_mobile_number: false,
        invalid_message: 'Please enter a valid mobile number.',
      });
      return false;
    }

    try {
      const { providerId } = await firebase.auth.PhoneAuthProvider.credential(verificationId, code);
      if (providerId) return true;
    } catch (err) {
      console.log(err);
    }
    this.setState({
      code: '',
      invalidCode: true,
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
      console.log(this.state);
      const { first_name, last_name, email, password, mobile_number } = this.state;
      console.log(first_name, last_name, email, password, mobile_number);
      const { user } = await auth.createUserWithEmailAndPassword(email, password);
      await createUserProfileDocument(user, {
        firstName,
        lastName,
        mobileNumber,
      });
      this.setState({ showModal: false });
    } catch (error) {
      this.setState({
        signupErrorMessage: error.message,
      });
    }
  };

  handleFailure = (error) => {
    this.setState({
      signupErrorMessage: error.errorMessage,
    });
  }

  render() {
    const { showModal } = this.state;
    if (this.state.showModal) {
      const {
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        code,
        showCodeInput,
        validated,
        invalidCode,
        invalidMobileNumber,
        invalidMessage,
      } = this.state;
      console.log(invalidCode, invalidMobileNumber, invalidMessage, validated);
      return (
        <Modal
          key={this.state.key}
          centered
          show={showModal}
          animation={true}
          onHide={this.hideModal}
        >
          <Modal.Body className="auth-modal">
            <div>
              <h3 className="sign">Sign in with</h3>
              <SocialOAuth hideModal={this.hideModal} onFailure={this.handleFailure}/>
              <br />
            </div>
            <Form noValidate validated={validated} onSubmit={this.handleSubmit}>
              <FormGroup>
                <Form.Control
                  required
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={firstName}
                  onChange={this.handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={lastName}
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
                    name="mobileNumber"
                    value={phoneNumber}
                    onChange={this.handleChange}
                    placeholder="Mobile Number"
                    required
                  />
                  <InputGroup.Append>
                    <InputGroup.Text>
                      <span className="btn-addon" onClick={this.submitPhoneNumber}>
                        Verify
                      </span>
                    </InputGroup.Text>
                  </InputGroup.Append>
                  {invalidMobileNumber && (
                    <Form.Control.Feedback type="invalid">{invalidMessage}</Form.Control.Feedback>
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
                  {invalidCode && (
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
