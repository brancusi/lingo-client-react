import React       from 'react';
import { connect } from 'react-redux';
import PropTypes from 'react-router';
import { processAuth0Data } from 'actions/session';

const mapStateToProps = (state) => ({
  session : state.session
});

export class OAuthView extends React.Component {
  static propTypes = {
    dispatch : React.PropTypes.func,
    params  : React.PropTypes.object
  };

  static contextTypes = {
    history: React.PropTypes.func
  };

  componentDidMount () {
    const { dispatch } = this.props;
    const lock = new Auth0Lock('IXz44ZCMA14vR3WOb48SH9JS14eQd9Wx', 'lingo.auth0.com');
    const parsed = lock.parseHash(window.location.hash);
    dispatch(processAuth0Data(parsed));
  }

  render () {
    const styles = {};

    return (
      <div className='flexCol stretch' style={styles}>
        <p>OAuth</p>
      </div>
    );
  }
}

export default connect(mapStateToProps)(OAuthView);
