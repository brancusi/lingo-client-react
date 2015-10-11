import React from 'react';
import Radium from 'radium';
import moment from 'moment';

@Radium
export default class Message extends React.Component {
  static propTypes = {
    message: React.PropTypes.object.isRequired
  }

  render () {
    const { message : { m, t } } = this.props;
    const timeAgo = moment.unix(t).fromNow();
    const name = 'Aram';

    const styles = {

    };

    return (
      <div style={styles}>
        <div className='row'>
          <div className='col-sm-12'>
            <span>{name}</span>
            <span>{timeAgo}</span>
          </div>
        </div>
        <div className='row'>
          <p className='col-sm-12'>{m}</p>
        </div>
      </div>
    );
  }
}
