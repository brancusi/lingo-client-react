import React from 'react';
import Radium from 'radium';

@Radium
export default class MediaStreams extends React.Component {
  static propTypes = {
    session: React.PropTypes.object
  }

  componentDidMount () {
    this._connectOT();
  }

  componentWillUnmount () {
    //  @TODO add cleanup here of ot
  }

  _connectOT () {
    const { session: { credentials: { apiKey, sessionId, token } } } = this.props;
    const { myStreamContainer, otherStreamsContainer } = this.refs;

    if (token) {
      const otSession = OT.initSession(apiKey, sessionId);
      otSession.on('streamCreated', event=> {
        otSession.subscribe(event.stream, otherStreamsContainer, {insertMode: 'append', width: 200, height: 150});
      });

      otSession.connect(token, err=>{
        if (err) {
          //  Handle error
        } else {
          otSession.publish(myStreamContainer, {width: 200, height: 150});
        }
      });
    }
  }

  render () {
    const styles = {
      padding: '5px',
      border: '3px dashed grey'
    };

    return (
      <div style={styles}>
        <div ref='myStreamContainer'></div>
        <div ref='otherStreamsContainer'></div>
      </div>
    );
  }
}
