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

    const picStyles = {
      borderRadius: '50%',
      width: 28,
      height: 28
    }

    if (isAuthenticated(auth)) {
      const { profile } = auth;
      const name = profile.get('given_name');
      const picURL = profile.get('picture');
      return (<img className="pull-right" src={picURL} style={picStyles} />);
    } else {
      return (<ul className="nav navbar-nav pull-right">
        <li className="nav-item">
          <a className="nav-link" onClick={login}>Login</a>
        </li>
      </ul>);
    }
  }
}
