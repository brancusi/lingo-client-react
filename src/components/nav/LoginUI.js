import { isAuthenticated } from 'services/auth';
import React from 'react';
import Radium from 'radium';

@Radium
export default class LoginUI extends React.Component {
  static propTypes = {
    login: React.PropTypes.func.isRequired,
    logout: React.PropTypes.func.isRequired,
    auth : React.PropTypes.object
  }

  render () {
    const { login, logout, auth } = this.props;

    if (isAuthenticated(auth)) {
      const { profile } = auth;
      return (<ul className="nav navbar-nav pull-right">
        <li className="nav-item">
          <a className="nav-link" onClick={logout}>Hi {profile.given_name}! - Logout</a>
        </li>
      </ul>);
    } else {
      return (<ul className="nav navbar-nav pull-right">
        <li className="nav-item">
          <a className="nav-link" onClick={login}>Login</a>
        </li>
      </ul>);
    }
  }
}
