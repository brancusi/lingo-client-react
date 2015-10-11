import { combineReducers } from 'redux';
import session from './session';
import auth from './auth';

export default combineReducers({
  session,
  auth
});
