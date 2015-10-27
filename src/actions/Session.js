import {
  JOIN_SESSION,
  PROCESS_SCRATCH_PAD_DATA_ADDED,
  PROCESS_SCRATCH_PAD_DATA_REMOVED,
  MERGE_CHAT_HISTORY,
  PROCESS_AUTH0_DATA
} from 'constants/session';
import fetch from 'isomorphic-fetch';
import guidFn from 'utils/guid';
import moment from 'moment';

export function processSessionInfo(data) {
  const { api_key, session_id, token, guid } = data;
  return {
    type: JOIN_SESSION,
    payload: {
      apiKey:api_key,
      sessionId:session_id,
      token,
      guid
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

export function retrieveSessionInfo(guid) {
  return dispatch => {
    return fetch(`https://api.saysss.com/sessions`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({guid})
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
    const baseFBUrl = 'https://saysss.firebaseio.com/';

    return new Promise((res, rej)=>{
      const key = guidFn();
      const fbRef = new Firebase(`${baseFBUrl}langits/${key}`);
      const data = {target:{local:'en'}};

      fbRef.set(data, err=>err ? rej(err) : res(key));
    })
    .then(key => {
      return new Promise((res, rej)=>{
        const fbRef = new Firebase(`${baseFBUrl}scratchPads/${sessionId}/`);
        const data = {
          id:key,
          type:'Langit',
          t:moment().valueOf()
        };

        fbRef.push(data, err=>err ? rej(err) : res(data));
      });
    });
  };
}

export function proccessChatHistory (history) {
  return {
    type: MERGE_CHAT_HISTORY,
    payload: history
  };
}

export function persistChatMessage (sessionId, msg, userId) {
  return dispatch => {
    const baseFBUrl = 'https://saysss.firebaseio.com/';
    const key = guidFn();
    const fbRef = new Firebase(`${baseFBUrl}chats/${sessionId}/${key}`);
    const message = {m:msg, t:moment().valueOf(), u:userId};

    dispatch(proccessChatHistory({[key]:message}));

    return new Promise((res, rej)=>{
      fbRef.set(message, err=>err ? rej(err) : res(message));
    });
  };
}

export function processProfileData (identityProviderData, auth0Data) {
  return {
    type: PROCESS_AUTH0_DATA,
    payload: {profile: identityProviderData, auth: auth0Data}
  };
}

/*
export function processAuth0Data (data) {

  return dispatch => {
    return fetch(`https://www.googleapis.com/plus/v1/people/108416995229181777890?key=AIzaSyCHNgYJfjqQ4nemJvKca6onFuiE30ZEuQc`, {
      method: 'get',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(identityData => {
      dispatch(processProfileData(identityData, data));
    });
  };
}
*/
