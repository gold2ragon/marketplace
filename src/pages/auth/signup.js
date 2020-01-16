import React, { Component } from 'react';
import SocialOAuth from './social-oauth';
import { auth, createUserProfileDocument } from '../../firebase';
import { Modal, Form, InputGroup, FormGroup } from 'react-bootstrap';
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import request from 'request';

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
      signupErrorMessage: '',
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
    this.setState({
      showModal: false,
      validated: false,
      invalidCode: false,
      invalidMobileNumber: false,
      invalidMessage: '',
      showCodeInput: false,
      signupErrorMessage: '',
    });
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

  doSendEmailVerification = () => {
    auth.currentUser.sendEmailVerification({
      url: `${window.location.origin}/email-verified`,
    });
  }

  submitPhoneNumber = async (event) => {
    event.preventDefault();
    let { mobileNumber } = this.state;
    const code = this.generateCode();
    const self = this;

    const numberPattern = /\d+/g;
    mobileNumber = '+' + mobileNumber.match( numberPattern ).join('');

    request.post('https://textbelt.com/text', {
      form: {
        phone: mobileNumber,
        message: `Your verification code for ${window.location.hostname} is ${code}`,
        key: process.env.REACT_APP_TEXTBELT_KEY,
      },
    }, function(err, httpResponse, body) {
      if (err) {
        this.setState({
          invalidMobileNumber: true,
          invalidMessage: err,
        })
        return;
      }
      self.setState({ invalidMobileNumber: false });
      self.setState({ showCodeInput: true, savedCode: code });
    });
  };

  verifyCode = () => {
    
    try {
      const { savedCode, code } = this.state;
      return code === savedCode;
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
      this.doSendEmailVerification();
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
        signupErrorMessage,
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
                    inputProps={{
                      name: 'mobileNumber',
                      required: true,
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
              {signupErrorMessage && <div className="error">{signupErrorMessage}</div>}
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
