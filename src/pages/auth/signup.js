import React, { Component } from 'react';
import FormInput from '../../components/form-input';
import Button from '../../components/button';
import Modal from '../../components/modal';
import SocialOAuth from './social-oauth';
import { auth, createUserProfileDocument } from '../../firebase';

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
    if (this.state.showModal) {
      const { displayName, email, password, phoneNumber } = this.state;
      return (
        <Modal key={this.state.key}>
          <div className="auth-modal">
            <h1 className="sign">Sign up with</h1>
            <SocialOAuth hideModal={this.hideModal} />
            <h1 className="sign">or Sign up</h1>
            <form onSubmit={this.handleSubmit}>
              <FormInput
                type="text"
                name="displayName"
                value={displayName}
                onChange={this.handleChange}
                label="Your name"
                required
              />
              <FormInput
                type="email"
                name="email"
                value={email}
                onChange={this.handleChange}
                label="Email"
                required
              />
              <FormInput
                type="password"
                name="password"
                value={password}
                onChange={this.handleChange}
                label="Password"
                required
              />
              <FormInput
                name="phoneNumber"
                value={phoneNumber}
                onChange={this.handleChange}
                label="Mobile Number"
                required
              />
              <Button type="submit">SIGN UP</Button>
            </form>
          </div>
        </Modal>
      );
    } else {
      return null;
    }
  }
}

export default SignUp;
