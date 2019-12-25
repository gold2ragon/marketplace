import { SET_CURRENT_USER } from '../../src/redux/actions/action-types';
import { createSelector } from 'reselect';

// initial state is the default state
const INITIAL_STATE = {
  currentUser: null
}

// if states is undefined or not set
const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload
      }
    default:
      return state;
  }
}

export default userReducer;
