import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Form, Button, FormGroup } from 'react-bootstrap';
import { saveProfileData } from '../../redux/actions/profile';
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';
import firebase, { auth } from '../../firebase';
import './settings.scss';

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      avatar: "",
      isUploading: false,
      progress: 0,
      avatarURL: "",
      firstName: '',
      lastName: '',
      email: '',
      mobileNumber: '',
      bankName: '',
      bankAccountNumber: '',
      nameOfAccountHolder: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      validated: false,
      authProviderId: '',
      isUpdatePasswordSucceeded: 0,
      errorMessageForPassword: '',
    };
  }
  componentDidMount() {
    const provider = auth.currentUser.providerData;
    this.setState({
      ...this.props.currentUser,
      authProviderId: provider.length > 0 ? provider[0].providerId : '',
    });
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleUploadStart = () => this.setState({ isUploading: true, progress: 0 });
  handleProgress = progress => this.setState({ progress });
  handleUploadError = error => {
    this.setState({ isUploading: false });
    console.error(error);
  };
  handleUploadSuccess = filename => {
    this.setState({ avatar: filename, progress: 100, isUploading: false });
    firebase
      .storage()
      .ref("images")
      .child(filename)
      .getDownloadURL()
      .then(url => this.setState({ avatarURL: url }));
  };

  // Reauthenticates the current user and returns a promise...
  reauthenticate = (currentPassword) => {
    let user = auth.currentUser;
    let cred = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
    return user.reauthenticateWithCredential(cred);
  }

  handleChangePassword = () => {
    const { currentPassword, newPassword } = this.state;
    this.reauthenticate(currentPassword).then(() => {
      let user = auth.currentUser;
      user.updatePassword(newPassword).then(() => {
        this.setState({
          isUpdatePasswordSucceeded: 1,
          errorMessageForPassword: 'Password is changed successfully.',
        });
      }).catch((error) => {
        this.setState({
          isUpdatePasswordSucceeded: -1,
          errorMessageForPassword: error.message,
        });
      });
    }).catch((error) => {
      this.setState({
        isUpdatePasswordSucceeded: -1,
        errorMessageForPassword: error.message,
      });
    });
  }

  handleSubmit = async (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      this.setState({ validated: true });
      return;
    }

    event.preventDefault();

    try {
      const {
        username,
        firstName,
        lastName,
        email,
        mobileNumber,
        bankName,
        bankAccountNumber,
        nameOfAccountHolder,
        avatarURL,
        newPassword,
        authProviderId,
      } = this.state;

      const profileData = {
        ...this.props.currentUser,
        username,
        firstName,
        lastName,
        email,
        mobileNumber,
        bankName,
        bankAccountNumber,
        nameOfAccountHolder,
        avatarURL,
      }
      this.props.saveProfileData(profileData);
      if (authProviderId === 'password' && newPassword) {
        this.handleChangePassword();
      }
    } catch (error) {
      console.log(error, 'err');
    }
  };

  render() {
    const {
      username,
      firstName,
      lastName,
      email,
      mobileNumber,
      bankName,
      bankAccountNumber,
      nameOfAccountHolder,
      currentPassword,
      newPassword,
      confirmPassword,
      validated,
      authProviderId,
      isUpdatePasswordSucceeded,
      errorMessageForPassword,
    } = this.state;

    return (
      <Form
        noValidate
        validated={validated}
        className="profile-settings"
        onSubmit={this.handleSubmit}
      >
        <h3>Profile</h3>
        <span className="upload-picture">
          <CustomUploadButton
            accept="image/*"
            storageRef={firebase.storage().ref('images')}
            onUploadStart={this.handleUploadStart}
            onUploadError={this.handleUploadError}
            onUploadSuccess={this.handleUploadSuccess}
            onProgress={this.handleProgress}
          >
            <img src={this.state.avatarURL || require('../../assets/user.png')} alt="avatar URL" />
            <div>Choose/Edit profile pic</div>
          </CustomUploadButton>
        </span>
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

        {authProviderId === 'password' && (
          <Fragment>
            <h3>Change password</h3>
            <br />
            <FormGroup>
              <Form.Control
                type="password"
                name="currentPassword"
                placeholder="Current Password"
                value={currentPassword}
                onChange={this.handleChange}
                isInvalid={!currentPassword && newPassword}
              />
              <Form.Control.Feedback type="invalid">Please enter current password to update password.</Form.Control.Feedback>
            </FormGroup>
            <FormGroup>
              <Form.Control
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={newPassword}
                onChange={this.handleChange}
                isInvalid={currentPassword && !newPassword}
              />
              <Form.Control.Feedback type="invalid">Please enter new password.</Form.Control.Feedback>
            </FormGroup>
            <FormGroup>
              <Form.Control
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={this.handleChange}
                isInvalid={(newPassword || confirmPassword) && (newPassword !== confirmPassword)}
              />
              <Form.Control.Feedback type="invalid">Password is not matched.</Form.Control.Feedback>
              {isUpdatePasswordSucceeded < 0 && (
                <div className="invalid-field">{errorMessageForPassword}</div>
              )}
              {isUpdatePasswordSucceeded > 0 && (
                <div className="valid-field">Password is changed successfully!</div>
              )}
            </FormGroup>
            <br />
          </Fragment>
        )}

        <h3>Payment Details</h3>
        <br />
        <Form.Control
          name="bankName"
          placeholder="Bank Name"
          value={bankName}
          onChange={this.handleChange}
        />
        <br />
        <Form.Control
          name="bankAccountNumber"
          placeholder="Bank Accout Number"
          value={bankAccountNumber}
          onChange={this.handleChange}
        />
        <br />
        <Form.Control
          name="nameOfAccountHolder"
          placeholder="Name of Account Holder"
          onChange={this.handleChange}
          value={nameOfAccountHolder}
        />
        <br />
        <Button variant="secondary" className="btn-main" type="submit">
          Save
        </Button>
        <br />
        <br />

        <div>
          Refer a Franchisee to us!<br />
          Know someone that might be interested in buying a franchise?<br />
          Send us their contact details and we will do all the rest!<br />
          Receive a referral fee when they open a franchise.
        </div>
        <br />
        <Button variant="secondary" className="btn-main">
          Get Started Now!
        </Button>
      </Form>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
  saveProfileData: (data) => dispatch(saveProfileData(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
