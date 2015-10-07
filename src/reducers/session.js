import { createReducer } from 'utils';
import { Map, List } from 'immutable';
import guid from 'utils/guid';

import {
  JOIN_SESSION,
  PROCESS_SCRATCH_PAD_DATA_ADDED,
  PROCESS_SCRATCH_PAD_DATA_REMOVED,
  PROCESS_NEW_LANGIT,
  ADD_CHAT_MESSAGE
} from 'constants/session';

// const initialState = new Map({
//   credentials:new Map({
//     apiKey:'45358762',
//     sessionId:'2_MX40NTM1ODc2Mn5-MTQ0Mzk4NTc5NzU5NX5VZ05ubFlMNzk2bFlhS0RRVVA1TDFGV05-UH4',
//     token:'T1==cGFydG5lcl9pZD00NTM1ODc2MiZzaWc9ZGZhZTdjNDNmOTE2MjZjMDc3MWNiZDg4ZGU4MzZkMTM5NGQ4NmIzMTpyb2xlPXB1Ymxpc2hlciZzZXNzaW9uX2lkPTJfTVg0ME5UTTFPRGMyTW41LU1UUTBNems0TlRjNU56VTVOWDVWWjA1dWJGbE1OemsyYkZsaFMwUlJWVkExVERGR1YwNS1VSDQmY3JlYXRlX3RpbWU9MTQ0NDAwNDA2OSZub25jZT0wLjg3Nzk5MjQ4MjU2OTAzOTU=',
//     uuid:'fake'
//   }),
//   scratchPad:new Map()
// });

const initialState = new Map({
  credentials:new Map(),
  scratchPad:new Map(),
  sessionChat:new List()
});

export default createReducer(initialState, {
  [ JOIN_SESSION ]:(state, payload)=>{
    const { apiKey, sessionId, token} = payload;
    const newMap = new Map({
      apiKey,
      sessionId,
      token
    });

    return state.set('credentials', newMap);
  },
  [ PROCESS_SCRATCH_PAD_DATA_ADDED ]:(state, payload)=>{
    const newScratch = state.get('scratchPad').set(payload.id, payload);
    return state.set('scratchPad', newScratch);
  },
  [ PROCESS_SCRATCH_PAD_DATA_REMOVED ]:(state, payload)=>{
    const newScratch = state.get('scratchPad').delete(payload.id);
    return state.set('scratchPad', newScratch);
  },
  [ PROCESS_NEW_LANGIT ]:(state)=>{
    return state;
  },
  [ ADD_CHAT_MESSAGE ]:(state, payload)=>{
    const id = guid();
    const msg = new Map({id, msg:payload});
    const sessionChat = state.get('sessionChat').push(msg);
    return state.set('sessionChat', sessionChat);
  }

});
