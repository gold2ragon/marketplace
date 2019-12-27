import { SET_SETTINGS_INPUT_VALUE } from '../actions/action-types';

const INITIAL_STATE = {
  userName: '',
  firstName: '',
  lastName: '',
  bio: '',
  email: '',
  mobileNumber: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  bankName: '',
  bankAccountNumber: '',
  nameOfAccountHolder: '',
};

const userSettings = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_SETTINGS_INPUT_VALUE:
      return {
        ...state, [action.payload.key]: action.payload.value,
      };
    default:
      return state;
  }
};

export default userSettings;
