import React from 'react';
import Radium from 'radium';

@Radium
export default class Message extends React.Component {
  static propTypes = {
    message: React.PropTypes.object.isRequired,
    expanded: React.PropTypes.string
  }

  render () {
    const { message : { m, u } } = this.props;
    const styles = {};

    const messageStyles = {
      fontSize: '0.9em',
      color: 'grey'
    };

    const nameStyles = {
      fontSize: '0.7em',
      fontStyle: 'italic',
      color: 'grey'
    };

    return (
      <div style={styles}>
        <div className='row'>
          <div className='col-sm-12'>
            <span style={nameStyles}>{u}:</span> <span style={messageStyles}>{m}</span>
          </div>
        </div>
      </div>
    );
  }
}
