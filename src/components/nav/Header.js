import React from 'react';
import Radium from 'radium';

@Radium
export default class Header extends React.Component {

  render () {
    const styles = {
      backgroundColor: '#e3f2fd'
    };

    return (
      <nav className="navbar navbar-light" style={styles}>
        <a className="navbar-brand" href="#">Lingo</a>
        <ul className="nav navbar-nav">
          <li className="nav-item">
            <a className="nav-link" href="#">About</a>
          </li>
        </ul>

        <ul className="nav navbar-nav pull-right">
          <li className="nav-item">
            <a className="nav-link" href="#">Method Man | Logout</a>
          </li>
        </ul>
      </nav>
    );
  }
}
