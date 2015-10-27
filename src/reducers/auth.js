import { createReducer } from 'utils';
import { Map } from 'immutable';

import * as Actions from 'constants/auth';

const initialState = new Map({jwt:'yo', profile: new Map({'given_name':'Aram', 'picture':'https://lh3.googleusercontent.com/-VaubpWApqU4/AAAAAAAAAAI/AAAAAAAAAK8/52OQ4n6koqw/photo.jpg'})});

export default createReducer(initialState, {
  [ Actions.PROCESS_AUTH_DATA ]:(state, payload)=>{
    return state.merge(payload);
  },
  [ Actions.AUTH_ERROR ]:(state, err)=>{
    return state.merge(new Map({err}));
  }
});
