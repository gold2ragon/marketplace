import React, { Component } from 'react';
import SocialOAuth from './social-oauth';
import { auth, createUserProfileDocument } from '../../firebase';
import { Modal, Button, Form,InputGroup } from 'react-bootstrap';

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      key: 1,
      displayName: '',
      email: '',
      password: '',
      phoneNumber: '',
      showModal: true,
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    const { displayName, email, password } = this.state;

    try {
      const { user } = await auth.createUserWithEmailAndPassword(email, password);

      await createUserProfileDocument(user, { displayName });

      this.setState({
        displayName: '',
        email: '',
        password: '',
        phoneNumber: '',
        showModal: false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  openModal = () => {
    this.setState({
      key: Math.random(),
      showModal: true,
    });
  };

  hideModal = () => {
    this.setState({ showModal: false });
  }

  render() {
    const { showModal } = this.state;
    if (this.state.showModal) {
      const { displayName, email, password, phoneNumber } = this.state;
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
            <form onSubmit={this.handleSubmit}>
              <Form.Control
                type="text"
                name="first_name"
                value={displayName}
                onChange={this.handleChange}
                placeholder="First Name"
                required
              />
              <Form.Control
                type="text"
                name="last_name"
                value={displayName}
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
                  <InputGroup.Text><a className="btn-addon">Verify</a></InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
              <Button variant="secondary" className="form-control" type="submit">Sign up</Button>
            </form>
          </Modal.Body>
        </Modal>
      );
    } else {
      return null;
    }
  }
}

export default SignUp;
