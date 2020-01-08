import { SET_LISTINGS, SET_ALL_CONTACTS } from '../actions/action-types';

// initial state is the default state
const INITIAL_STATE = {
  listings: [],
}

// if states is undefined or not set
const adminReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_LISTINGS:
      return {
        ...state,
        listings: action.payload
      }
    case SET_ALL_CONTACTS:
      return {
        ...state,
        contacts: action.payload
      }
    default:
      return state;
  }
}


export default adminReducer;
