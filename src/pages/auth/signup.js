import React, { Component } from 'react';
import SocialOAuth from './social-oauth';
import { auth, createUserProfileDocument } from '../../firebase';
import { Modal, Button, Form, InputGroup, FormGroup } from 'react-bootstrap';
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import firebase from 'firebase/app';

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
    this.setState({ mobileNumber: value }, () => {
      console.log(this.state.mobileNumber);
    });
  };

  submitPhoneNumber = async (event) => {
    event.preventDefault();
    const { mobileNumber } = this.state;
    this.setState({
      invalidMobileNumber: false,
    });
  };

  verifyCode = async () => {
    const { mobileNumber, code } = this.state;
    if (!mobileNumber) {
      this.setState({
        invalidMobileNumber: false,
        invalidMessage: 'Please enter a mobile number.',
      });
      return false;
    }
    if (!window.confirmationResult) {
      this.setState({
        validated: false,
        invalidMobileNumber: true,
        invalidMessage: 'Please verify mobile number',
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
      const { firstName, lastName, email, password, mobileNumber } = this.state;
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
