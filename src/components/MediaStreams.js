import React from 'react';
import Radium from 'radium';

@Radium
export default class MediaStreams extends React.Component {
  static propTypes = {
    session: React.PropTypes.object.isRequired
  }

  componentDidMount () {
    this._createRxStreams();
    this._subscribeToStreams();
    this._processPropChange();
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
    this._processPropChange();
  }

  componentWillUnmount () {
    this._disposeRxStreams();
  }

  _createRxStreams () {
    this._credentialsSubject = new Rx.Subject();

    this._credentials = this._credentialsSubject
      .filter(obj => obj !== undefined)
      .filter(obj => obj.apiKey !== undefined);

    this._sessions = this._credentials
      .map(({apiKey, sessionId, token}) => ({session:OT.initSession(apiKey, sessionId), token}));

    this._connectedSessions = this._sessions
      .flatMapLatest(({session, token}) => Rx.Observable.create(observer => {
        session.connect(token, err => {
          if (err) {
            observer.onError(err);
          } else {
            observer.onNext(session);
          }
        });

        return Rx.Disposable.create(() => session.disconnect());
      }));

    this._createdStreams = this._sessions
      .flatMap(({session}) => Rx.Observable.create(observer => {
        session.on('streamCreated', event => observer.onNext({stream:event.stream, session}));
        return Rx.Disposable.create(() => session.off('streamCreated'));
      }));
  }

  _subscribeToStreams () {
    const { myStreamContainer, otherStreamsContainer } = this.refs;
    const myMediaOptions = { width : 200, height: 150 };
    const othersMediaOptions = { insertMode: 'append', width : 200, height: 150 };

    this._disposeSessionSubscription = this._connectedSessions
        .subscribe(session => session.publish(myStreamContainer, myMediaOptions));

    this._disposeStreamCreatedSubscription = this._createdStreams
        .subscribe(({stream, session}) => session.subscribe(stream, otherStreamsContainer, othersMediaOptions));
  }

  _processPropChange () {
    const { session: { credentials: { apiKey, sessionId, token } } } = this.props;
    this._credentialsSubject.onNext({apiKey, sessionId, token});
  }

  _disposeRxStreams () {
    if (this._disposeSessionSubscription) {
      this._disposeSessionSubscription.dispose();
    }

    if (this._disposeStreamCreatedSubscription) {
      this._disposeStreamCreatedSubscription.dispose();
    }
  }

  render () {
    const rootStyles = {
      display: 'flex'
    };

    const otherStreamsContainerStyles = {
      display: 'flex'
    };

    return (
      <div className='row' style={rootStyles}>
        <div ref='myStreamContainer'></div>
        <div ref='otherStreamsContainer' style={otherStreamsContainerStyles}></div>
      </div>
    );
  }
}
