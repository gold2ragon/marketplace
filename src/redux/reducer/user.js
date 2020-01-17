import {
  SET_CURRENT_USER,
  SET_USER_CONTACTS,
  SET_SEARCH_RESULTS,
  SHOW_SIGNIN_MODAL,
  SHOW_SIGNUP_MODAL,
  HIDE_MODAL,
} from '../actions/action-types';

// initial state is the default state
const INITIAL_STATE = {
  currentUser: null,
  contacts: [],
  showSignInModal: false,
  showSignUpModal: false,
};

// if states is undefined or not set
const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload,
      };
    case SET_USER_CONTACTS:
      return {
        ...state,
        contacts: action.payload,
      };
    case SET_SEARCH_RESULTS:
      return {
        ...state,
        searchResults: action.payload,
      };
    case SHOW_SIGNIN_MODAL:
      return {
        ...state,
        showSignInModal: true,
        showSignUpModal: false,
      };
    case SHOW_SIGNUP_MODAL:
      return {
        ...state,
        showSignInModal: false,
        showSignUpModal: true,
      };
    case HIDE_MODAL:
      return {
        ...state,
        showSignInModal: false,
        showSignUpModal: false,
      };
    default:
      return state;
  }
};

export default userReducer;
