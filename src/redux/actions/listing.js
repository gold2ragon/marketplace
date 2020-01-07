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
      const docs = await listingsRef.get();
      const listings = [];
      for (const doc of docs) {
        listings.push(await doc.data());
      }
      console.log('listings: ', listings);
      dispatch(setListings(listings));
    } catch (error) {
      console.log('error getting listings', error);
    }
  }
}

export const addListing = (listing) => {
  return async (dispatch) => {
    try {
      await firestore.collection('listings').add({
        ...listing,
      });
      dispatch(getListings());
    } catch (error) {
      console.log('error adding listing', error);
    }
  }
};