import React from 'react';
import Radium from 'radium';
import moment from 'moment';

@Radium
export default class Message extends React.Component {
  static propTypes = {
    message: React.PropTypes.object.isRequired,
    expanded: React.PropTypes.string
  }

  render () {
    const { message : { m, t, u } } = this.props;
    const timeAgo = moment(t).format('HH:mm');

    const styles = {
      // border: '1px solid red'
    };

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
