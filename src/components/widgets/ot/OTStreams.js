import React from 'react';
import Radium from 'radium';
import PublishManager from 'components/widgets/ot/publisher/Manager';
import StreamsManager from 'components/widgets/ot/streams/Manager';
import guid from 'utils/guid';

@Radium
export default class OTStreams extends React.Component {
  static propTypes = {
    credentials: React.PropTypes.object.isRequired,
    profileImageUrl: React.PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount () {
    this._connectSession();
  }

  shouldComponentUpdate (nextProps, nextState) {
    const { credentials } = this.props;

    const propsChanged = !credentials.equals(nextProps.credentials);
    const stateChanged = (this.state.session !== nextState.session);

    return (propsChanged || stateChanged);
  }

  componentDidUpdate (prevProps) {
    const { credentials } = this.props;

    if (!credentials.equals(prevProps.credentials)) {
      this._processPropChange();
    }
  }

  componentWillUnmount () {
    this.session.disconnect();
  }

  _processPropChange () {
    this._clearSession();
    this._connectSession();
  }

  _clearSession () {
    if (this.session) {
      this.session.disconnect();
    }
  }

  _connectSession () {
    const { credentials: { apiKey, sessionId, token } } = this.props;
    const session = OT.initSession(apiKey, sessionId);
    this.session = session.connect(token, err => (err) ? this._registerError(err) : this._registerSession(session));
  }

  _registerSession (session) {
    this.setState({session:session});
  }

  _registerError (err) {
    this.setState({error:err});
  }

  render () {
    const containerStyles = {
      display: 'flex',
      height: 153,
      borderTop: '3px dashed red',
      borderRight: '3px dashed red'
    };

    const { profileImageUrl } = this.props;
    const { session } = this.state;
    const isConnected = session ? true : false;

    if (isConnected) {
      return (
        <div style={containerStyles}>
          <PublishManager session={session} profileImageUrl={profileImageUrl} />
          <StreamsManager session={session} />
        </div>
      );
    } else {
      return (
        <div style={containerStyles}>
          <h4>I pity the unconnected fool</h4>
        </div>
      );
    }
  }
}
