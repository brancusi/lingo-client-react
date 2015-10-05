import React       from 'react';
import { connect } from 'react-redux';
import MediaStreams from 'components/MediaStreams';
import ScratchPad from 'components/ScratchPad';
import LearningToolbar from 'components/LearningToolbar';
import {
  processScratchPadChildAdded,
  processScratchPadChildRemoved,
  createLangit
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
    this._addScratchListeners();
  }

  componentWillUnmount () {
    this._removeScratchListeners();
  }

  _createNewLangit () {
    const { dispatch, session : { credentials : { sessionId } } } = this.props;
    dispatch(createLangit(sessionId));
  }

  _addScratchListeners () {
    const { dispatch, session : { credentials : { sessionId } } } = this.props;
    const baseFBURL = 'https://lingoapp.firebaseio.com/scratchPads/';

    this.fbScratchRef = new Firebase(`${baseFBURL}${sessionId}`);

    this.fbScratchRef.on('child_added', snapShot => dispatch(processScratchPadChildAdded(snapShot.val())));
    this.fbScratchRef.on('child_removed', snapShot => dispatch(processScratchPadChildRemoved(snapShot.val())));
  }

  _removeScratchListeners () {
    this.fbScratchRef.off('child_added');
    this.fbScratchRef.off('child_removed');
  }

  render () {
    const { session, session:{ scratchPad } } = this.props;

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
