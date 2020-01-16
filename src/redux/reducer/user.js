import { SET_CURRENT_USER, SET_USER_CONTACTS, SET_SEARCH_RESULTS } from '../actions/action-types';

// initial state is the default state
const INITIAL_STATE = {
  currentUser: null,
  contacts: [],
}

// if states is undefined or not set
const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload
      }
    case SET_USER_CONTACTS:
      return {
        ...state,
        contacts: action.payload
      }
    case SET_SEARCH_RESULTS:
      return {
        ...state,
        searchResults: action.payload
      }
    default:
      return state;
  }
}


export default userReducer;
