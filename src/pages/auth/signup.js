import React, { Component } from 'react';
import SocialOAuth from './social-oauth';
import { auth, createUserProfileDocument } from '../../firebase';
import { Modal, Button, Form, InputGroup, FormGroup } from 'react-bootstrap';
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import firebase from 'firebase/app';
import request from 'request';

const CORS_URL = 'https://cors-anywhere.herokuapp.com/';

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
      signupErrorMessage: '',
    });
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handlePhoneNumberChange = (value) => {
    this.setState({ mobileNumber: value, invalidCode: false }, () => {
    });
  };

  generateCode = () => {
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += parseInt(Math.random() * 10);
    }
    return code;
  }

  submitPhoneNumber = async (event) => {
    event.preventDefault();
    const { mobileNumber } = this.state;
    const code = this.generateCode();
    const self = this;
    request.post('https://textbelt.com/text', {
      form: {
        phone: mobileNumber,
        message: `Your verification code for ${window.location.hostname} is ${code}`,
        key: process.env.REACT_APP_TEXTBELT_KEY,
      },
    }, function(err, httpResponse, body) {
      if (err) {
        console.error('Error:', err);
        return;
      }
      self.setState({ showCodeInput: true, savedCode: code });
    })
    // try {
    //   const projectID = process.env.REACT_APP_FIREBASE_AUTH_DOMAIN.split('.')[0];
    //   await fetch(CORS_URL + `https://us-central1-${projectID}.cloudfunctions.net/sendCode`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ mobileNumber }),
    //   });
    //   this.setState({ showCodeInput: true });
    // } catch ({ error }) {
    //   console.log(error);
    // }
  };

  verifyCode = () => {
    
    try {
      const { savedCode, code } = this.state;
      return code === savedCode;

      // const projectID = process.env.REACT_APP_FIREBASE_AUTH_DOMAIN.split('.')[0];
      // const { result } = await fetch(CORS_URL + `https://us-central1-${projectID}.cloudfunctions.net/verifyCode`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ mobileNumber, code }),
      // });
      // console.log('isVerified: ' + result);
      // return result;
    } catch ({ error }) {
      console.log(error);
    }
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
        this.setState({ invalidCode: true, validated: true });
        return;
      }
      this.setState({ invalidCode: false, validated: false });
      const { firstName, lastName, email, password, mobileNumber } = this.state;
      const { user } = await auth.createUserWithEmailAndPassword(email, password);
      await createUserProfileDocument(user, {
        displayName: firstName + ' ' + lastName,
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
  };

  render() {
    const { showModal } = this.state;
    if (this.state.showModal) {
      const {
        firstName,
        lastName,
        email,
        password,
        mobileNumber,
        code,
        showCodeInput,
        validated,
        invalidCode,
        invalidMobileNumber,
        invalidMessage,
      } = this.state;
      return (
        <Modal
          size="lg"
          key={this.state.key}
          centered
          show={showModal}
          animation={true}
          onHide={this.hideModal}
        >
          <Modal.Body className="auth-modal">
            <div>
              <h3 className="sign">Sign up with</h3>
              <SocialOAuth hideModal={this.hideModal} onFailure={this.handleFailure} />
              <br />
              <h3 className="sign">or with your E-mail</h3>
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
                  <ReactPhoneInput
                    containerClass="react-tel-input phone-number-input input-group-append"
                    inputExtraProps={{
                      name: 'phone',
                      required: true,
                      autoFocus: true,
                    }}
                    country={'sg'}
                    placeholder="Mobile Number"
                    value={mobileNumber}
                    onChange={this.handlePhoneNumberChange}
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
              <button className="btn-main" type="submit">
                Sign up
              </button>
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
