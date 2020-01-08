import { firestore } from '../../firebase';
import { SET_LISTINGS } from './action-types';

export const setListings = (listings) => ({
  type: SET_LISTINGS,
  payload: listings,
});

export const getListings = () => {
  return async (dispatch) => {
    const listingsRef = firestore.collection('listings');
    try {
      const { docs } = await listingsRef.get();
      const listings = {};
      for (const doc of docs) {
        const listing = await doc.data();
        listings[[doc.id]] = listing;
      }
      dispatch(setListings(listings));
    } catch (error) {
      console.log('error getting listings', error);
    }
  }
}

export const deleteListing = (id) => {
  return async (dispatch) => {
    try {
      await firestore.doc(`listings/${id}`).delete();
      dispatch(getListings());
    } catch (error) {
    }
  }
}

export const saveListing = (id, listing) => {
  return async (dispatch) => {
    try {
      if (id === 'new') {
        await firestore.collection('listings').add({
          ...listing,
        });
      } else {
        await firestore.doc(`listings/${id}`).set({
          ...listing,
        })
      }
      dispatch(getListings());
    } catch (error) {
      console.log('error adding listing', error);
    }
  }
};