// src/store.js
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'; // For handling asynchronous actions
import rootReducer from './reducers'; // Combine your reducers here

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
