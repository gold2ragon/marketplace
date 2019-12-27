import { SET_SETTINGS_INPUT_VALUE } from './action-types';
import { store } from '../store';
import firebase from 'firebase';
import { firestore } from '../../firebase';

export const setInputValue = (value, name) => {
  for (let key in store.getState().userSettings) {
    if (key.toLowerCase() === name.trim().split(' ').join('').toLowerCase()) {
      return dispatch => {
        dispatch({
          type: SET_SETTINGS_INPUT_VALUE,
          payload: {
            key,
            value,
          },
        });
      };
    }
  }
};

export const createSettingsData = () => {

  return async (dispatch, getState) => {
    const { currentUser } = firebase.auth();
    const userRef = await firestore.doc(`users/${currentUser.uid}`);

    try {
      await userRef.set({
        settings: getState().userSettings,
      });
    } catch (e) {
      console.log('error creating user', e.message);
    }
    dispatch();
  };
};
