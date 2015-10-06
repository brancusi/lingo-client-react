import React from 'react';
import Radium from 'radium';

@Radium
export default class MediaStreams extends React.Component {
  static propTypes = {
    session: React.PropTypes.object.isRequired
  }

  componentDidMount () {
    this._connectOT();
  }

  shouldComponentUpdate (nextProps) {
    const { session : { credentials }} = this.props;
    if (credentials) {
      return !credentials.equals(nextProps.session.get('credentials'));
    } else {
      return true;
    }
  }

  componentDidUpdate () {
    this._connectOT();
  }

  componentWillUnmount () {

  }

  _connectOT () {
    const { session: { credentials: { apiKey, sessionId, token } } } = this.props;
    const { myStreamContainer, otherStreamsContainer } = this.refs;

    if (token) {
      this.otSession = OT.initSession(apiKey, sessionId);

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

  _disconnect () {}

  render () {
    const styles = {
      border: '3px dashed grey',
      display: 'flex'
    };

    return (
      <div style={styles}>
        <div ref='myStreamContainer'></div>
        <div ref='otherStreamsContainer'></div>
      </div>
    );
  }
}
