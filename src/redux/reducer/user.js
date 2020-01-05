import { SET_CURRENT_USER, SET_USER_BUSINESS } from '../actions/action-types';

// initial state is the default state
const INITIAL_STATE = {
  currentUser: null,
  business: [],
}

// if states is undefined or not set
const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload
      }
    case SET_USER_BUSINESS:
      return {
        ...state,
        business: action.payload
      }
    default:
      return state;
  }
}


export default userReducer;
