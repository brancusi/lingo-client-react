import { createReducer } from 'utils';
import { Map } from 'immutable';

import * as Actions from 'constants/auth';

const initialState = new Map();

export default createReducer(initialState, {
  [ Actions.PROCESS_AUTH_DATA ]:(state, payload)=>{
    return state.merge(payload);
  },
  [ Actions.AUTH_ERROR ]:(state, err)=>{
    return state.merge(new Map({err}));
  }
});
