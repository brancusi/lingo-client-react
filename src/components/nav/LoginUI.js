import { isAuthenticated } from 'services/auth';
import React from 'react';
import Radium from 'radium';
import { Link } from 'react-router';

@Radium
export default class LoginUI extends React.Component {

  render () {
    const { login, logout, auth } = this.props;

    if(isAuthenticated(auth)) {

      const { profile : { given_name } } = auth;
      return (<ul className="nav navbar-nav pull-right">
        <li className="nav-item">
          <a className="nav-link" onClick={logout}>Hi {given_name}! - Logout</a>
        </li>
      </ul>);
    }else {
      return (<ul className="nav navbar-nav pull-right">
        <li className="nav-item">
          <a className="nav-link" onClick={login}>Login</a>
        </li>
      </ul>)
    }
  }
}
