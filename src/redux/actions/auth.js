import { SET_CURRENT_USER } from './action-types';
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