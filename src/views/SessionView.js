import React       from 'react';
import { connect } from 'react-redux';
import MediaStreams from 'components/MediaStreams';
import ScratchPad from 'components/ScratchPad';
import LearningToolbar from 'components/LearningToolbar';
import {
  processScratchPadChildAdded,
  processScratchPadChildRemoved,
  createLangit,
  retrieveSessionInfo
} from 'actions/session';

const mapStateToProps = (state) => {
  return {session : state.session};
};

export class SessionView extends React.Component {
  static propTypes = {
    dispatch : React.PropTypes.func,
    session  : React.PropTypes.object
  };

  componentDidMount () {
    this._joinSession();
  }

  componentDidUpdate (previousState, prevProps) {
    if(!this._listeningToFB){
      this._joinSession();
    }
  }

  shouldComponentUpdate (nextProps) {
    const { session } = this.props;
    if(session){
      return !session.equals(nextProps.session);
    } else {
      return true;
    }
  }

  componentWillUnmount () {
    this._removeScratchListeners();
  }

  _joinSession () {
    const { session : { credentials : { sessionId } } } = this.props;

    if(sessionId) {
      this._addScratchListeners();
    }else{
      const { dispatch, params : { id } } = this.props;

      if(id){
        dispatch(retrieveSessionInfo(id));
      }else{
        console.log('Dispatch error, missing sessionId');
      }
    }
  }

  _createNewLangit () {
    const { dispatch, session : { credentials : { sessionId } } } = this.props;
    dispatch(createLangit(sessionId));
  }

  _addScratchListeners () {
    if(!this._listeningToFB){
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

    if(this.fbScratchRef){
      this.fbScratchRef.off('child_added');
      this.fbScratchRef.off('child_removed');
    }
  }

  render () {
    const { session, session:{ scratchPad } } = this.props;
    console.log('Render called', session);
    return (
      <div>
        <MediaStreams session={session} />
        <ScratchPad scratchPad={scratchPad} />
        <LearningToolbar createLangit={::this._createNewLangit}/>
      </div>
    );
  }

}

export default connect(mapStateToProps)(SessionView);
