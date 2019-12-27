import React from 'react';
import styles from './settings.module.css';
import Input from './components/Input';
import { connect } from 'react-redux';
import { createSettingsData, setInputValue } from '../../redux/actions/userSettings';
import logo from '../../assets/356e996071544808b68b59f070dcee3e.png';

const Settings = ({ setInputValue, userSettings, a }, props) => {
  const setValueControl = (control, data) => {
    for (let key in data) {
      if (key.toLowerCase() === control.trim().split(' ').join('').toLowerCase()) {
        return data[key];
      }
    }
  };

  return (
    <div className={styles.settings}>
      <h2>Settings</h2>

      <h4>Profile</h4>

      <img src={logo} alt="logo"/>

      <h4>Choose/Edit profile pic</h4>

      <h4 className={styles.profileText}>Public Profile</h4>

      <Input value={() => setValueControl('Username', userSettings)} placeholder={'Username'} margin='10px 0 15px 0'
             callback={setInputValue}/>
      <Input value={() => setValueControl('First Name', userSettings)} placeholder={'First Name'} margin='10px 0 0 0'
             callback={setInputValue}/>
      <Input value={() => setValueControl('Last Name', userSettings)} placeholder={'Last Name'} margin='10px 0 20px 0'
             callback={setInputValue}/>
      <textarea
        className={`form-control ${styles.nameControlArea}`}
        cols="30" rows="5" placeholder='Bio'
        onChange={(e) => setInputValue(e.target.value, 'bio')}
        value={setValueControl('Bio', userSettings)}
      />

      <h4 className={styles.privateText}>Private Information</h4>

      <h6>We do not share these information with users unless explicit permission is given by you</h6>

      <Input value={() => setValueControl('Email', userSettings)} placeholder={'Email'} margin='0 0 10px 0' type='email'
             callback={setInputValue}/>
      <Input value={() => setValueControl('Mobile Number', userSettings)} placeholder={'Mobile Number'}
             margin='10px 0 10px 0' callback={setInputValue}/>


      <h4 className={styles.passwordText}>Change password</h4>

      <Input value={() => setValueControl('Current password', userSettings)} placeholder='Current password'
             type='password' margin='5px 0 10px 0' callback={setInputValue}/>
      <Input value={() => setValueControl('New password', userSettings)} placeholder='New password' type='password'
             margin='5px 0 10px 0' callback={setInputValue}/>
      <Input value={() => setValueControl('Confirm password', userSettings)} placeholder='Confirm password'
             type='password' margin='5px 0 17px 0' callback={setInputValue}/>

      <button className={`btn`} onClick={() => createSettingsData(userSettings)}>Save</button>

      <h4 className={styles.paymentText}>Payment Details</h4>

      <Input value={() => setValueControl('Bank Name', userSettings)} placeholder='Bank Name' margin='0 0 20px 0'
             width='60%' callback={setInputValue}/>
      <Input value={() => setValueControl('Bank Account Number', userSettings)} placeholder='Bank Account Number'
             margin='0 0 20px 0' width='60%' callback={setInputValue}/>
      <Input value={() => setValueControl('Name of Account Holder', userSettings)} placeholder='Name of Account Holder'
             margin='0 0 10px 0' width='60%' callback={setInputValue}/>

      <div className={styles.noteText}>
        <p>Refer a business to us and let us do all the rest.</p>
        <p>Receive 3% of the transaction value when the deal concludes successfully concludes.</p>
      </div>


      <button className={`btn`}>Get Started Now!</button>
    </div>
  );
};

const mapStateToProps1 = ({ userSettings }) => {
  return { userSettings };
};

export default connect(mapStateToProps1, { setInputValue, createSettingsData })(Settings);
