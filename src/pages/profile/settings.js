import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import { auth } from '../../firebase';

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
    return (
      <Form className="profile-settings">
        <h3>Settings</h3>
        <br />
        <h3>Profile</h3>
        <a>
          <img className="upload-picture" src={require('../../assets/user.png')} alt="picture" />
          <div>Choose/Edit profile pic</div>
        </a>
        <br />
        <h3>Public Profile</h3><br />
        <Form.Control type="text" name="username" placeholder="Username" />
        <Form.Control type="text" name="first_name" placeholder="First Name" />
        <Form.Control type="text" name="last_name" placeholder="Last Name" />
        <Form.Control as="textarea" rows="3" placeholder="bio" />

        <br />
        <h3>Private Information</h3>
        <br />
        <div>
          We do not share these information with other users unless explicit permission is given by
          you.
        </div>
        <Form.Control type="email" name="email" placeholder="Email" />
        <br />
        <Form.Control type="tel" name="phone_number" placeholder="Mobile Number" />
        <br />

        <h3>Change password</h3>
        <br />
        <Form.Control type="password" name="current_password" placeholder="Current Password" />
        <Form.Control type="password" name="new_password" placeholder="New Password" />
        <Form.Control type="password" name="confirm_password" placeholder="Confirm Password" />
        <br />
        
        <h3>Payment Details</h3>
        <br />
        <Form.Control type="password" name="bank_name" placeholder="Bank Name" />
        <Form.Control type="password" name="bank_account_number" placeholder="Bank Accout Number" />
        <Form.Control type="password" name="name_of_account_holder" placeholder="Name of Account Holder" />
        <Button variant="secondary" className="btn-main">
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
