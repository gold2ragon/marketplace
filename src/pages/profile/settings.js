import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import { auth, updateUserProfileDocument } from '../../firebase';

import './settings.scss';

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      firstName: '',
      lastName: '',
      bio: '',
      email: '',
      mobileNumber: '',
      bankName: '',
      bankAccountNumber: '',
      nameOfAccountHolder: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      validated: false,
    };
  }

  componentDidMount() {
    const user = auth.currentUser;
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
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
      const user = await auth.currentUser;
      await updateUserProfileDocument(user, { ...this.state });

      this.setState({
        username: '',
        firstName: '',
        lastName: '',
        bio: '',
        email: '',
        mobileNumber: '',
        bankName: '',
        bankAccountNumber: '',
        nameOfAccountHolder: '',
      });
    } catch (error) {
      console.log(error, 'err');
    }
  };

  render() {
    const {
      username,
      firstName,
      lastName,
      bio,
      email,
      mobileNumber,
      bankName,
      bankAccountNumber,
      nameOfAccountHolder,
      currentPassword,
      newPassword,
      confirmPassword,
      validated,
    } = this.state;

    console.log(this.state);
    return (
      <Form noValidate validated={validated} className="profile-settings" onSubmit={this.handleSubmit}>
        <h3>Settings</h3>
        <br />
        <h3>Profile</h3>
        <a>
          <img className="upload-picture" src={require('../../assets/user.png')} alt="picture" />
          <div>Choose/Edit profile pic</div>
        </a>
        <br />
            
        <h3>Public Profile</h3>
        <br />
        <Form.Control
          type="text"
          name="username"
          value={username}
          placeholder="Username"
          onChange={this.handleChange}
          required
        />
        <br />
        <Form.Control
          type="text"
          name="firstName"
          value={firstName}
          placeholder="First Name"
          onChange={this.handleChange}
          required
        />
        <br />
        <Form.Control
          type="text"
          name="lastName"
          value={lastName}
          placeholder="Last Name"
          onChange={this.handleChange}
          required
        />
        <br />
        <Form.Control
          as="textarea"
          name="bio"
          rows="3"
          placeholder="bio"
          value={bio}
          onChange={this.handleChange}
          required
        />
        <br />
        <br />
        <h3>Private Information</h3>
        <br />
        <div>
          We do not share these information with other users unless explicit permission is given by
          you.
        </div>
        <Form.Control
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={this.handleChange}
          required
        />
        <br />
        <Form.Control
          type="tel"
          name="mobileNumber"
          placeholder="Mobile Number"
          value={mobileNumber}
          onChange={this.handleChange}
          required
        />
        <br />

        <h3>Change password</h3>
        <br />
        <Form.Control 
          type="password"
          name="currentPassword"
          placeholder="Current Password"
          value={currentPassword}
          onChange={this.handleChange}
          required
        />
        <br />

        <Form.Control 
          type="password"
          name="newPassword"
          placeholder="New Password" 
          value={newPassword}
          onChange={this.handleChange}
          required
        />
        <br />
        <Form.Control
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={this.handleChange}
          required
        />
        <br />
        <br />

        <h3>Payment Details</h3>
        <br />
        <Form.Control
          type="password"
          name="bankName"
          placeholder="Bank Name"
          value={bankName}
          onChange={this.handleChange}
          required
        />
        <br />
        <Form.Control
          type="password"
          name="bankAccountNumber"
          placeholder="Bank Accout Number"
          value={bankAccountNumber}
          onChange={this.handleChange}
          required
        />
        <br />
        <Form.Control
          type="password"
          name="nameOfAccountHolder"
          placeholder="Name of Account Holder"
          onChange={this.handleChange}
          value={nameOfAccountHolder}
          required
        />
        <br />
        <Button variant="secondary" className="btn-main" type="submit">
          Save
        </Button>
        <br />
        <br />

        <div>
          Refer a business to us and let us do all the rest. <br />
          Receive 3% of the transaction value when the deal concludes successfully concludes.
        </div>
        <br />
        <Button variant="secondary" className="btn-main">
          Get Started Now!
        </Button>
      </Form>
    );
  }
}

export default Settings;
