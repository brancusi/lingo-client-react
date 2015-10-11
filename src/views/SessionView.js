import React       from 'react';
import { connect } from 'react-redux';
import OTStreams from 'components/widgets/ot/OTStreams';
import ScratchPad from 'components/ScratchPad';
import Chat from 'components/widgets/chat/Chat';
import LearningToolbar from 'components/LearningToolbar';
import LinkShare from 'components/widgets/share/LinkShare';
import {
  processScratchPadChildAdded,
  processScratchPadChildRemoved,
  createLangit,
  retrieveSessionInfo,
  persistChatMessage,
  proccessChatHistory
} from 'actions/session';

const mapStateToProps = (state) => {
  return {session : state.session};
};

export class SessionView extends React.Component {
  static propTypes = {
    dispatch : React.PropTypes.func,
    session  : React.PropTypes.object,
    params  : React.PropTypes.object
  };

  componentDidMount () {
    this._joinSession();
  }

  shouldComponentUpdate (nextProps) {
    const { session } = this.props;
    if (session) {
      return !session.equals(nextProps.session);
    } else {
      return true;
    }
  }

  componentDidUpdate () {
    if (!this._listeningToFB) {
      this._joinSession();
    }
  }

  componentWillUnmount () {
    this._removeScratchListeners();
  }

  _joinSession () {
    const { session : { credentials : { sessionId } } } = this.props;

    if (sessionId) {
      this._addFBListeners();
    } else {
      const { dispatch, params : { id } } = this.props;

      if (id) {
        dispatch(retrieveSessionInfo(id));
      } else {
        //  console.log('Dispatch error, missing sessionId');
      }
    }
  }

  _createNewLangit () {
    const { dispatch, session : { credentials : { sessionId } } } = this.props;
    dispatch(createLangit(sessionId));
  }

  _addChatMessage (msg) {
    const { dispatch, session : { credentials : { sessionId } } } = this.props;
    dispatch(persistChatMessage(sessionId, msg));
  }

  _addFBListeners () {
    if (!this._listeningToFB) {
      this._listeningToFB = true;
      const { dispatch, session : { credentials : { sessionId } } } = this.props;
      const baseFBURL = 'https://lingoapp.firebaseio.com/';
      this.fbScratchRef = new Firebase(`${baseFBURL}scratchPads/${sessionId}`).orderByChild('t');
      this.fbScratchRef.on('child_added', snapShot => dispatch(processScratchPadChildAdded(snapShot.val())));
      this.fbScratchRef.on('child_removed', snapShot => dispatch(processScratchPadChildRemoved(snapShot.val())));

      this.fbChatRef = new Firebase(`${baseFBURL}chats/${sessionId}`);
      this.fbChatRef.on('value', snapShot => dispatch(proccessChatHistory(snapShot.val())));
    }
  }

  _removeScratchListeners () {
    this._listeningToFB = false;

    if (this.fbScratchRef) {
      this.fbScratchRef.off('child_added');
      this.fbScratchRef.off('child_removed');
    }

    if (this.fbChatRef) {
      this.fbChatRef.off('value');
    }
  }

  _hasCredentialsFragment () {
    const { session, session:{ credentials, scratchPad, sessionChat, credentials: { guid } } } = this.props;

    const comStyles = {
      alignItems: 'flex-end',
      zIndex: 1000
    };

    const shareLink = `http://localhost:5000/sessions/${guid}`;

    return (
      <div className='stretch flexCol'>
        <LinkShare link={shareLink} />
        <div className='row stretch' >
          <ScratchPad scratchPad={scratchPad} />
        </div>

        <LearningToolbar createLangit={::this._createNewLangit}/>

        <div className='row' style={comStyles}>
          <div className='col-sm-6 col-xl-8'>
            <OTStreams credentials={credentials} />
          </div>
          <div className='col-sm-6 col-xl-4'>
            <Chat sessionChat={sessionChat} addChatMessage={::this._addChatMessage}/>
          </div>
        </div>
      </div>
    );
  }

  _defaultFragment () {
    return (
      <div className='stretch flexCol'>
        <p>Loading...</p>
      </div>
    );
  }

  render () {
    const { session, session:{ credentials : { apiKey, sessionId, token } } } = this.props;

    const hasCredentials = ((apiKey !== undefined) &&
                            (sessionId !== undefined) &&
                            (token !== undefined));

    if (hasCredentials) {
      return this._hasCredentialsFragment();
    } else {
      return this._defaultFragment();
    }

  }

}

export default connect(mapStateToProps)(SessionView);
