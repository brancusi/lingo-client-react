import React from 'react';
import Radium from 'radium';

@Radium
export default class Footer extends React.Component {
  static propTypes = {
    lock : React.PropTypes.object
  }

  render () {
    const styles = {
      backgroundColor: '#231F20',
      padding: '2em 2em 1em 2em',
      color: 'rgba(255, 255, 255, 0.4)'
    };

    return (
      <div className="row" style={styles}>
        <div className='col-sm-8'>
          <p>Lingo - 0.0.1 - <small>Learn something cool everyday.</small></p>
        </div>
        <div className='col-sm-4 text-right'>
          <p><small>Copyright &#169; Lingo LLC 2015. All rights reserved.</small></p>
        </div>

      </div>
    );
  }
}
