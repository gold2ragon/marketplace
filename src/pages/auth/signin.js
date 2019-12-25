import React, { Component } from 'react';
import FormInput from '../../components/form-input';
import Button from '../../components/button';
import Modal from '../../components/modal';
import SocialOAuth from './social-oauth';
import { auth } from '../../firebase';

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
  }

  render() {
    if (this.state.showModal) {
      return (
        <Modal key={this.state.key}>
          <div className="auth-modal">
            <h1 className="sign">Log in with</h1>
            <SocialOAuth hideModal={this.hideModal} />
            <h1 className="sign">or Log in</h1>
            <form onSubmit={this.handleSubmit}>
              <FormInput
                name="email"
                value={this.state.email}
                handleChange={this.handleChange}
                label="Email"
                required
              />

              <FormInput
                name="password"
                type="password"
                value={this.state.password}
                handleChange={this.handleChange}
                label="Password"
                required
              />
              <div className="buttons">
                <Button type="submit">Log in</Button>
              </div>
            </form>
          </div>
        </Modal>
      );
    } else {
      return null;
    }
  }
}

export default SignIn;
