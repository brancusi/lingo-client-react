import React from 'react';
import Radium from 'radium';

@Radium
export default class Header extends React.Component {
  static propTypes = {
    lock : React.PropTypes.object
  }

  _showLock () {
    this.props.lock.show();
  }
  //  <a className="nav-link" href="#">Method Man | Logout</a>
  render () {
    const styles = {
      backgroundColor: '#e3f2fd'
    };

    const loginUI = (
      <ul className="nav navbar-nav pull-right">
        <li className="nav-item">
          <a className="nav-link" onClick={::this._showLock}>Login</a>
        </li>
      </ul>
    );

    return (
      <div className="row">
        <nav className="col-sm-12 navbar navbar-light" style={styles}>
          <a className="navbar-brand" href="#">Lingo</a>
          <ul className="nav navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="#">About</a>
            </li>
          </ul>
          {loginUI}
        </nav>
      </div>
    );
  }
}
