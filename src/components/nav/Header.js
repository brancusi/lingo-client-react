import React from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import LoginUI from 'components/nav/LoginUI';

@Radium
export default class Header extends React.Component {
  static propTypes = {
    login: React.PropTypes.func.isRequired,
    logout: React.PropTypes.func.isRequired,
    auth : React.PropTypes.object
  }

  render () {
    const styles = {
      backgroundColor: '#e3f2fd',
      fontFamily: 'sofia-pro-soft, sans-serif'
    };

    const { login, logout, auth } = this.props;

    return (
      <div className="row">
        <nav className="col-sm-12 navbar navbar-light" style={styles}>
          <Link to={`/`} className="navbar-brand">Say Something Somewhere Somehow</Link>
          <LoginUI login={login} logout={logout} auth={auth}/>
        </nav>
      </div>
    );
  }
}
