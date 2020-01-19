import { auth, firestore } from '../../firebase';
import { SET_USER_CONTACTS, SET_ALL_CONTACTS } from './action-types';

export const setUserContacts = (contacts) => ({
  type: SET_USER_CONTACTS,
  payload: contacts,
});

export const setAllContacts = (contacts) => ({
  type: SET_ALL_CONTACTS,
  payload: contacts,
});

export const getAllContacts = () => {
  return async (dispatch) => {
    const contactsRef = firestore.collection('contacts');
    try {
      const { docs } = await contactsRef.get();
      let contacts = {};
      for (const doc of docs) {
        const contact = await doc.data();
        contacts = {
          ...contacts,
          ...contact,
        };
      }
      dispatch(setAllContacts(contacts));
    } catch (error) {
      console.log('error getting contacts', error);
    }
  }
}

export const getUserContacts = () => {
  return async (dispatch) => {
    const { currentUser } = auth;
    const contactsRef = firestore.doc(`contacts/${currentUser.uid}`);
    try {
      const doc = await contactsRef.get();
      let data = doc.data();
      if (!data) data = [];
      dispatch(setUserContacts(data));
    } catch (error) {
      console.log('error getting user contacts', error);
    }
  };
};

export const submitUserContacts = (contacts) => {
  return async (dispatch) => {
    const { currentUser } = auth;
    const contactsRef = firestore.doc(`contacts/${currentUser.uid}`);
    try {
      await contactsRef.set({ ...contacts });
      dispatch(getUserContacts());
    } catch (error) {
      console.log('error submitting user contacts', error);
    }
  };
};

export const changeContactMarked = (contact) => {
  return async (dispatch) => {
    try {
      contact.marked = !contact.marked;
      const userRef = firestore.doc(`contacts/${contact.userId}`);
      await userRef.update({
        [contact.id]: contact,
      });
      dispatch(getAllContacts());
    } catch (error) {
      console.log('error submitting contact marked', error);
    }
  };
};