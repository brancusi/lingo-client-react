import React       from 'react';
import { connect } from 'react-redux';
import MediaStreams from 'components/MediaStreams';
import ScratchPad from 'components/ScratchPad';
import Chat from 'components/widgets/Chat';
import LearningToolbar from 'components/LearningToolbar';
import {
  processScratchPadChildAdded,
  processScratchPadChildRemoved,
  createLangit,
  retrieveSessionInfo,
  addChatMessage
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
      this._addScratchListeners();
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
    const { dispatch } = this.props;
    dispatch(addChatMessage(msg));
  }

  _addScratchListeners () {
    if (!this._listeningToFB) {
      this._listeningToFB = true;
      const { dispatch, session : { credentials : { sessionId } } } = this.props;
      const baseFBURL = 'https://lingoapp.firebaseio.com/scratchPads/';

      this.fbScratchRef = new Firebase(`${baseFBURL}${sessionId}`);

      this.fbScratchRef.on('child_added', snapShot => dispatch(processScratchPadChildAdded(snapShot.val())));
      this.fbScratchRef.on('child_removed', snapShot => dispatch(processScratchPadChildRemoved(snapShot.val())));
    }
  }

  _removeScratchListeners () {
    this._listeningToFB = false;

    if (this.fbScratchRef) {
      this.fbScratchRef.off('child_added');
      this.fbScratchRef.off('child_removed');
    }
  }

  render () {
    const { session, session:{ scratchPad, sessionChat } } = this.props;
    return (
      <div className='flexStretch flexCol'>
        <div className='flexStretch' >
          <ScratchPad scratchPad={scratchPad} />
        </div>
        <Chat sessionChat={sessionChat} addChatMessage={::this._addChatMessage}/>
        <LearningToolbar createLangit={::this._createNewLangit}/>
        <MediaStreams session={session} />
      </div>
    );
  }

}

export default connect(mapStateToProps)(SessionView);
