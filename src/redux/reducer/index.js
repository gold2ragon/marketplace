import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from './auth';
import userSettings from './userSettings';

const persistConfig = {
  key: 'root',
  storage,
}


const rootReducer = combineReducers({
  user: userReducer,
  userSettings: userSettings
});

export default persistReducer(persistConfig, rootReducer);
