import { auth, firestore } from '../../firebase';

export const saveProfileData = (profileData) => {
  return async (dispatch) => {
    const { currentUser } = auth;
    const userRef = firestore.doc(`users/${currentUser.uid}`);
    try {
      await userRef.update({
        ...profileData,
      });
    } catch (error) {
      console.log('error updating user', error);
    }
  }
};