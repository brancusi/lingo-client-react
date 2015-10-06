import {
  JOIN_SESSION,
  PROCESS_SCRATCH_PAD_DATA_ADDED,
  PROCESS_SCRATCH_PAD_DATA_REMOVED,
  PROCESS_NEW_LANGIT
} from 'constants/session';
import fetch from 'isomorphic-fetch';
import guid from 'utils/guid';

export function processSessionInfo(data) {
  const { api_key, session_id, token} = data;
  return {
    type: JOIN_SESSION,
    payload: {
      apiKey:api_key,
      sessionId:session_id,
      token
    }
  };
}

export function processScratchPadChildAdded(data) {
  return {
    type: PROCESS_SCRATCH_PAD_DATA_ADDED,
    payload: data
  };
}

export function processScratchPadChildRemoved(data) {
  return {
    type: PROCESS_SCRATCH_PAD_DATA_REMOVED,
    payload: data
  };
}

export function retrieveSessionInfo(roomName) {
  return dispatch => {
    return fetch(`http://bobcat.lingo.development.c66.me/sessions`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        room_name:roomName
      })
    })
    .then(response => response.json())
    .then(data => {
      dispatch(processSessionInfo(data));
    });
  };
}

export function processNewLangit (data) {
  return {
    type: PROCESS_NEW_LANGIT,
    payload: data
  };
}

export function createLangit(sessionId) {
  return () => {
    const baseFBUrl = 'https://lingoapp.firebaseio.com/';

    return new Promise((res, rej)=>{
      const key = guid();
      const fbRef = new Firebase(`${baseFBUrl}langits/${key}`);
      const data = {target:{local:'en'}};

      fbRef.set(data, err=>err ? rej(err) : res(key));
    })
    .then(key => {
      return new Promise((res, rej)=>{
        const fbRef = new Firebase(`${baseFBUrl}scratchPads/${sessionId}/`);
        const data = {type:'Langit', id:key};

        fbRef.push(data, err=>err ? rej(err) : res(data));
      });
    });
  };
}
