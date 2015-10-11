import * as Actions from 'constants/auth';

const AUTH0_KEY = 'IXz44ZCMA14vR3WOb48SH9JS14eQd9Wx';
const AUTH0_APP_URL = 'lingo.auth0.com';

export function processAuth0Data (profile, jwt, accessToken) {
  return {
    type: Actions.PROCESS_AUTH_DATA,
    payload: {
      profile,
      jwt,
      accessToken
    }
  };
}

export function processAuth0Error (err) {
  return {
    type: Actions.AUTH_ERROR,
    payload: err
  };
}

export function login () {
  return dispatch =>
    new Promise((res, rej) => {
      new Auth0Lock(AUTH0_KEY, AUTH0_APP_URL)
        .show({}, (err, ...rest) => err ? rej(err) : res(rest));
    })
    .then(data => dispatch(processAuth0Data(...data)))
    .catch(err => dispatch(processAuth0Error(err)));
}

export function logout () {
  return {
    type: 'LOGOUT_YO'
  };
}
