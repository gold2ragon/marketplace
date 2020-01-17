import firebase, { firestore } from '../../firebase';
import {
  SET_LISTINGS,
  SET_FEATRUED_FRANCHISES,
  SET_CUISINE_TYPES,
  SET_SEARCH_RESULTS,
} from './action-types';
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
        cuisineTypes[type] = {};
        cuisineTypes[type].url = listing.public.photos[0];
        cuisineTypes[type].count = 1;
      } else {
        cuisineTypes[type].count++;
      }
    });
    dispatch(setCuisineTypes(cuisineTypes));
  };
};

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
  };
};

export const getFeaturedFranchises = () => {
  return async (dispatch) => {
    const listingsRef = firestore.collection('listings').where('isFeatured', '==', true);
    try {
      const { docs } = await listingsRef.get();
      const listings = {};
      for (const doc of docs) {
        const listing = await doc.data();
        listings[[doc.id]] = listing;
      }
      dispatch(setFeaturedFranchises(listings));
    } catch (error) {
      console.log('error getting featured listings', error);
    }
  };
};

export const setFeaturedFranchises = (listings) => ({
  type: SET_FEATRUED_FRANCHISES,
  payload: listings,
});

export const deleteListing = (id) => {
  return async (dispatch) => {
    try {
      const docData = await firestore.doc(`listings/${id}`).get();
      const doc = docData.data();
      const images = doc.public.photos;
      for (const image of images) {
        const filename = image.match(/%2F(.*?)\?alt/)[1];
        await firebase
          .storage()
          .ref(`listings/${filename}`)
          .delete();
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
  };
};

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
        });
      }
      dispatch(getListings());
    } catch (error) {
      console.log('error adding listing', error);
    }
  };
};

export const setSearchResults = (results) => ({
  type: SET_SEARCH_RESULTS,
  payload: results,
});

export const getSearchResults = (keyword, cuisineType, minprice, maxprice) => {
  return async (dispatch) => {
    try {
      const listingsRef = firestore.collection('listings');
      let query = listingsRef;
      if (cuisineType !== 'Cuisine Type')
        query = query.where('public.cuisineType', '==', cuisineType);
      if (minprice) query = query.where('public.franchiseFee', '>=', parseInt(minprice));
      if (maxprice) query = query.where('public.franchiseFee', '<=', parseInt(maxprice));

      const { docs } = await query.get();
      const listings = [];
      for (const doc of docs) {
        const listing = await doc.data();
        listings.push({
          id: doc.id,
          ...listing,
        });
      }
      let results = listings;
      if (keyword) {
        results = [];
        for (const listing of listings) {
          if (listing.public.restaurantName.toLowerCase().includes(keyword.toLowerCase())) {
            results.push(listing);
          }
        }
      }
      dispatch(setSearchResults(results));
    } catch (error) {
      console.log('error adding listing', error);
    }
  };
};
