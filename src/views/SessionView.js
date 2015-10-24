import React       from 'react';
import { connect } from 'react-redux';
import ScratchPad from 'components/ScratchPad';
import LearningToolbar from 'components/LearningToolbar';
import LinkShare from 'components/widgets/share/LinkShare';
import CommunicationHud from 'components/CommunicationHud';

import {
  processScratchPadChildAdded,
  processScratchPadChildRemoved,
  createLangit,
  retrieveSessionInfo,
  persistChatMessage,
  proccessChatHistory
} from 'actions/session';

import {
  uploadAudio
} from 'actions/langit';

import plumb from 'imports?this=>window!script!../../node_modules/jsplumb/dist/js/jsPlumb-2.0.3.js';

const mapStateToProps = (state) => {
  return {
    session : state.session,
    auth : state.auth,
    langits: state.langits
  };
};

export class SessionView extends React.Component {
  static propTypes = {
    dispatch : React.PropTypes.func,
    session  : React.PropTypes.object,
    auth     : React.PropTypes.object,
    langits  : React.PropTypes.object,
    params   : React.PropTypes.object
  };

  componentDidMount () {
    this._joinSession();
  }

  // shouldComponentUpdate (nextProps) {
  //   const { session } = this.props;
  //   if (session) {
  //     return !session.equals(nextProps.session);
  //   } else {
  //     return true;
  //   }
  // }

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

  _saveRecording (langitId, recording) {
    const { dispatch, session : { credentials : { sessionId } } } = this.props;
    dispatch(uploadAudio(sessionId, langitId, recording));
  }

  _addChatMessage (msg) {
    const {
      dispatch,
      session : { credentials : {
        sessionId
      }},
      auth : { profile : {
        given_name
      }}
    } = this.props;
    dispatch(persistChatMessage(sessionId, msg, given_name));
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
    const { dispatch, langits, session:{ credentials, scratchPad, sessionChat, credentials: { guid } } } = this.props;

    const shareLink = `http://localhost:5000/sessions/${guid}`;

    const toolBarStyles = {
      paddingBottom: 200
    }
    
    return (
      <div className='stretch flexCol'>
        <div className='row stretch' >
          <ScratchPad scratchPad={scratchPad} langits={langits} saveRecording={::this._saveRecording} dispatch={dispatch}/>
        </div>
        <div style={toolBarStyles}>
          <LearningToolbar createLangit={::this._createNewLangit}/>
        </div>
        <CommunicationHud creds={credentials} chat={sessionChat} newChatMessage={::this._addChatMessage} />
      </div>
    );
  }

  // <LearningToolbar createLangit={::this._createNewLangit}/>

  _defaultFragment () {
    return (
      <div className='stretch flexCol'>
        <p>Loading...</p>
      </div>
    );
  }

  render () {
    const { session:{ credentials : { apiKey, sessionId, token } } } = this.props;

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
