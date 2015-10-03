import { createReducer } from 'utils';
import { Map } from 'immutable';
import { JOIN_SESSION } from 'constants/room';

const initialState = new Map();

export default createReducer(initialState, {
  [ JOIN_SESSION ]:(state, payload)=>{
    const { apiKey, sessionId, token} = payload;
    return new Map({
      apiKey,
      sessionId,
      token
    })
  }
});
