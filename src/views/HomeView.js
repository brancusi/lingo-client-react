import React       from 'react';
import { connect } from 'react-redux';
import { retrieveSessionInfo } from 'actions/session';
import SessionJoiner from 'components/SessionJoiner';
import Footer from 'components/nav/Footer';
import PropTypes from 'react-router';

const mapStateToProps = (state) => ({
  session : state.session
});

export class HomeView extends React.Component {
  static propTypes = {
    dispatch : React.PropTypes.func,
    session  : React.PropTypes.object
  };

  static contextTypes = {
    history: React.PropTypes.object
  };

  _join(guid) {
    this.context.history.pushState(null, `/sessions/${guid}`);
  }

  render () {
    const styles = {};

    return (
      <div className='flexCol stretch' style={styles}>
        <div className='row stretch'>
          <SessionJoiner join={::this._join} />
        </div>
        <Footer />
      </div>
    );
  }
}

export default connect(mapStateToProps)(HomeView);
