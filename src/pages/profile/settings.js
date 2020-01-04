import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import { auth, updateUserProfileDocument } from '../../firebase';

import './settings.scss';

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      first_name: '',
      last_name: '',
      bio: '',
      email: '',
      mobile_number: '',
      bank_name: '',
      bank_account_number: '',
      name_of_account_holder: '',
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
    event.preventDefault();
    try {
      const user = await auth.currentUser;
      await updateUserProfileDocument(user, { ...this.state });

      this.setState({
        username: '',
        first_name: '',
        last_name: '',
        bio: '',
        email: '',
        mobile_number: '',
        bank_name: '',
        bank_account_number: '',
        name_of_account_holder: '',
      });
    } catch (error) {
      console.log(error, 'err');
    }
  };

  render() {
    const {
      username,
      first_name,
      last_name,
      bio,
      email,
      mobile_number,
      bank_name,
      bank_account_number,
      name_of_account_holder,
    } = this.state;

    console.log(this.state);
    return (
      <Form className="profile-settings" onSubmit={this.handleSubmit}>
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
        />
        <br />
        <Form.Control
          type="text"
          name="first_name"
          value={first_name}
          placeholder="First Name"
          onChange={this.handleChange}
        />
        <br />
        <Form.Control
          type="text"
          name="last_name"
          value={last_name}
          placeholder="Last Name"
          onChange={this.handleChange}
        />
        <br />
        <Form.Control
          as="textarea"
          name="bio"
          rows="3"
          placeholder="bio"
          value={bio}
          onChange={this.handleChange}
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
        />
        <br />
        <Form.Control
          type="tel"
          name="mobile_number"
          placeholder="Mobile Number"
          value={mobile_number}
          onChange={this.handleChange}
        />
        <br />

        <h3>Change password</h3>
        <br />
        <Form.Control type="password" name="current_password" placeholder="Current Password" />
        <Form.Control type="password" name="new_password" placeholder="New Password" />
        <Form.Control type="password" name="confirm_password" placeholder="Confirm Password" />
        <br />
        <br />

        <h3>Payment Details</h3>
        <br />
        <Form.Control
          type="password"
          name="bank_name"
          placeholder="Bank Name"
          value={bank_name}
          onChange={this.handleChange}
        />
        <br />
        <Form.Control
          type="password"
          name="bank_account_number"
          placeholder="Bank Accout Number"
          value={bank_account_number}
          onChange={this.handleChange}
        />
        <br />
        <Form.Control
          type="password"
          name="name_of_account_holder"
          placeholder="Name of Account Holder"
          onChange={this.handleChange}
          value={name_of_account_holder}
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
