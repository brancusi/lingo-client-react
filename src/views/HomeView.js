import React       from 'react';
import { connect } from 'react-redux';
import * as sessionActions from 'actions/session';
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

  _join(sessionUID) {
    const { dispatch } = this.props;
    dispatch(sessionActions.retrieveSessionInfo(sessionUID))
      .then(()=>{
        this.context.history.pushState(null, `/sessions/${sessionUID}`);
      });
  }

  render () {
    return (
      <SessionJoiner join={::this._join} />
    );
  }
}

HomeView.contextTypes = { history: PropTypes.history };

export default connect(mapStateToProps)(HomeView);
