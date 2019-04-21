import { combineReducers } from 'redux';
import emailReducer from './email';

/**
 * Load and combine all reducers.
 */
export default combineReducers({
  email: emailReducer,
});
