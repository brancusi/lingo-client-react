import React       from 'react';
import { connect } from 'react-redux';
import { retrieveSessionInfo } from 'actions/session';
import SessionJoiner from 'components/SessionJoiner';
import PropTypes from 'react-router';

const mapStateToProps = (state) => ({
  session : state.session
});

export class HomeView extends React.Component {
  static propTypes = {
    dispatch : React.PropTypes.func,
    session  : React.PropTypes.object
  };

  _join(sessionId) {
    const { dispatch } = this.props;
    dispatch(retrieveSessionInfo(sessionId))
      .then(()=>{
        this.context.history.pushState(null, `/sessions/${sessionId}`);
      });
  }

  render () {
    const styles = {};

    return (
      <div className='row' style={styles}>
        <SessionJoiner join={::this._join} />
      </div>
    );
  }
}

HomeView.contextTypes = { history: PropTypes.history };

export default connect(mapStateToProps)(HomeView);
