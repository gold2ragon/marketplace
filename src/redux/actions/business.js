import { auth, firestore } from '../../firebase';
import { SET_USER_BUSINESS } from './action-types';

export const setUserBusiness = (business) => ({
  type: SET_USER_BUSINESS,
  payload: business,
})

export const getUserBusiness = () => {
  return async (dispatch) => {
    const { currentUser } = auth;
    const businessRef = firestore.doc(`business/${currentUser.uid}`);
    try {
      const doc = await businessRef.get();
      const data = doc.data();
      const { business } = data;
      dispatch(setUserBusiness(business));
    } catch (error) {
      console.log('error getting user business', error);
    }
  }
}

export const submitUserBusiness = (business) => {
  return async (dispatch) => {
    const { currentUser } = auth;
    const businessRef = firestore.doc(`business/${currentUser.uid}`);
    try {
      await businessRef.set({business});
      dispatch(getUserBusiness());
    } catch (error) {
      console.log('error submitting user business', error);
    }
  }
};