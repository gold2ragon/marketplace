import { SET_CURRENT_USER, SHOW_SIGNUP_MODAL, SHOW_SIGNIN_MODAL, HIDE_MODAL } from './action-types';
import { createSelector } from 'reselect';

export const setCurrentUser = user => ({
  type: SET_CURRENT_USER,
  payload: user
});

const selectUser = state => state.user;

export const selectCurrentUser = createSelector(
  [selectUser],
  (user) => user.currentUser
);

export const showSignInModal = () => ({
  type: SHOW_SIGNIN_MODAL,
  payload: 'show sign in modal'
});

export const showSignUpModal = () => ({
  type: SHOW_SIGNUP_MODAL,
  payload: 'show sign up modal'
});

export const hideModal = () => ({
  type: HIDE_MODAL,
  payload: 'hide modal'
})