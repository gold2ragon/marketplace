import { createStore, applyMiddleware } from 'redux';
// import { persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import rootReducer from './reducer';

const middlewares = [];
middlewares.push(thunk);
if (process.env.NODE_ENV === 'development') {
  middlewares.push(logger);
}

export const store = createStore(rootReducer, applyMiddleware(...middlewares));

// export const persistor = persistStore(store);
// export default { store, persistor };

export default { store };
