import { SET_SETTINGS_INPUT_VALUE } from './action-types';
import { store } from '../store';


export const setInputValue = (value, name) => {
  for (let x in store.getState().userSettings) {
    if (x.toLowerCase() === name.trim().split(' ').join('').toLowerCase()) {
      return {
        type: SET_SETTINGS_INPUT_VALUE,
        payload: {
          key: x,
          value,
        },
      };
    }
  }
};

