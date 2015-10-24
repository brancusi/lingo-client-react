import { combineReducers } from 'redux';
import session from './session';
import auth from './auth';
import langits from './langits';
import { routerStateReducer } from 'redux-router';

export default combineReducers({
  session,
  auth,
  langits,
  router: routerStateReducer
});
