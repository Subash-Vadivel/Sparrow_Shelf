import { combineReducers } from 'redux';
import auth from './auth'; 
import content from './content'
const rootReducer = combineReducers({
  auth: auth, 
  content:content
});

export default rootReducer;
