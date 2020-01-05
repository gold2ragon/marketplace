import React, { Component } from 'react';
import SocialOAuth from './social-oauth';
import { auth } from '../../firebase';
import { Modal, Button, Form } from 'react-bootstrap';

class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      key: 1,
      email: '',
      password: '',
      showModal: true,
    };
  }

  handleSubmit = async (event) => {
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
      console.log(error);
    }
  };

  handleChange = (event) => {
    console.log(event);
    const { value, name } = event.target;
    this.setState({ [name]: value });
  };

  openModal = () => {
    this.setState({
      key: Math.random(),
      showModal: true,
    });
  };

  hideModal = () => {
    this.setState({ showModal: false });
  };

  render() {
    const { showModal } = this.state;
    if (this.state.showModal) {
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
              <h3 className="sign">Log in with</h3>
              <SocialOAuth hideModal={this.hideModal} />
              <br />
            </div>
            <form onSubmit={this.handleSubmit}>
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
                <Button variant="secondary" className="form-control" type="submit">Log in</Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      );
    } else {
      return null;
    }
  }
}

export default SignIn;
