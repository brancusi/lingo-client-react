import React from 'react';
import Radium from 'radium';
import moment from 'moment';

@Radium
export default class Message extends React.Component {
  static propTypes = {
    message: React.PropTypes.object.isRequired
  }

  render () {
    const { message : { m, t, u } } = this.props;
    const timeAgo = moment(t).format('HH:mm');

    const styles = {

    };

    const nameStyles = {
      fontSize: '0.9em',
      color: 'grey'
    };

    const timeStyles = {
      fontSize: '0.7em',
      fontStyle: 'italic',
      color: 'grey'
    };

    return (
      <div style={styles}>
        <div className='row'>
          <div className='col-sm-12'>
            <span style={nameStyles}>{u}</span> <span style={timeStyles}>{timeAgo}</span>
          </div>
        </div>
        <div className='row'>
          <p className='col-sm-12'>{m}</p>
        </div>
      </div>
    );
  }
}
