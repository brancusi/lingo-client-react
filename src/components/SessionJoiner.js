import React from 'react';
import Radium from 'radium';
import guid from 'utils/guid';

@Radium
export default class SessionJoiner extends React.Component {
  static propTypes = {
    join: React.PropTypes.func.isRequired
  }

  _clickHandler () {
    this.props.join(guid());
  }

  render () {
    const styles = {};

    return (
      <div className='col-md-4 col-md-offset-4' style={styles}>
        <div className="card card-block">
          <h3 className="card-title">Start a class!</h3>
          <p className="card-text">Do a realdeal class with quickness.</p>
          <a className='btn btn-primary' onClick={::this._clickHandler}>
            Create a class
          </a>
        </div>
      </div>
    );
  }
}
