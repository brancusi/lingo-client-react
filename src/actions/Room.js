import { JOIN_SESSION } from 'constants/room';
import fetch from 'isomorphic-fetch';

export function processToken(data) {
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

export function joinRoom(roomName) {

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
      dispatch(processToken(data))
    })

  };
}
