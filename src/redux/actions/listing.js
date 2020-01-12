import firebase, { firestore } from '../../firebase';
import { SET_LISTINGS , SET_CUISINE_TYPES} from './action-types';
import _ from 'lodash';

export const setListings = (listings) => ({
  type: SET_LISTINGS,
  payload: listings,
});

export const setCuisineTypes = (cuisineTypes) => ({
  type: SET_CUISINE_TYPES,
  payload: cuisineTypes,
});

export const getCuisineTypes = (listings) => {
  return async (dispatch) => {
    const cuisineTypes = {};
    _.map(listings, (listing) => {
      const type = listing.public.cuisineType;
      if (!cuisineTypes[type]) {
        cuisineTypes[type] = {}
        cuisineTypes[type].url = listing.public.photos[0];
        cuisineTypes[type].count = 1;
      } else {
        cuisineTypes[type].count ++;
      }
    });
    dispatch(setCuisineTypes(cuisineTypes));
  }
}

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
      dispatch(getCuisineTypes(listings));
    } catch (error) {
      console.log('error getting listings', error);
    }
  }
}

export const deleteListing = (id) => {
  return async (dispatch) => {
    try {
      const docData = await firestore.doc(`listings/${id}`).get();
      const doc = docData.data();
      const images = doc.public.photos;
      for (const image of images) {
        const filename = image.match(/%2F(.*?)\?alt/)[1];
        await firebase.storage().ref(`listings/${filename}`).delete();
      }
    } catch (error) {
      console.log(error);
    }
    try {
      await firestore.doc(`listings/${id}`).delete();
    } catch (error) {
      console.log(error);
    }
    dispatch(getListings());
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