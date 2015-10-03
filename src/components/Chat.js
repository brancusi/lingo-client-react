import React from 'react';
import Radium from 'radium';

@Radium
export default class Chat extends React.Component {
  static propTypes = {
    room: React.PropTypes.object
  }

  componentDidMount () {
    console.log('componentDidMount');
    this._connect()
  }

  _connect(){
    const { room } = this.props;
    const { myStreamContainer, otherStreamsContainer } = this.refs;

    if(room.get('token')){

      const session = OT.initSession(room.get('apiKey'), room.get('sessionId'));

      session.on("streamCreated", event=> {
         session.subscribe(event.stream, otherStreamsContainer, {insertMode: 'append', width: 200, height: 150});
      });

      session.connect(room.get('token'), err=>{
        if (err) {
          console.log(error.message);
        } else {
          session.publish(myStreamContainer, {width: 200, height: 150});
        }
      });
    }

  }

  render () {
    return (
      <div style={styles}>
        <div ref="myStreamContainer"></div>
        <div ref="otherStreamsContainer"></div>
      </div>
    );
  }
}

var styles = {
  // background: '#0074D9',
  padding: '5px',
  border: '3px dashed grey'
};
