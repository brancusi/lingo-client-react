import {
  PROCESS_WIDGET_DATA
} from 'constants/langit';

export function processWidgetData (payload) {
  return {
    type: PROCESS_WIDGET_DATA,
    payload: payload
  };
}

export function persistAudio (sessionId, langitId, path) {
  return () => {
    const baseFBUrl = 'https://saysss.firebaseio.com/';
    const fbRef = new Firebase(`${baseFBUrl}langits/${langitId}/widgets`);
    const payload = {type:'audio', url:path};
    return new Promise((res, rej)=>{
      fbRef.push(payload, err=>err ? rej(err) : res(payload));
    });
  };
}

export function uploadAudio (sessionId, langitId, recording) {
  return dispatch => {
    return new Promise((res, rej) => {
      fetch(`https://api.saysss.com/aws/sign`, { method: 'post'})
        .then(response => response.json())
        .then(awsData => {
          const { signed_url, path } = awsData;
          fetch(signed_url, { method: 'put', body: recording.blob})
            .then(() => res(dispatch(persistAudio(sessionId, langitId, path))))
            .catch(err => rej(err));
        });
    });
  };
}
