import React       from 'react';
import { connect } from 'react-redux';
import { login } from 'actions/auth';
import { isAuthenticated } from 'services/auth';
import { bindActionCreators } from 'redux';

const mapStateToProps = (state) => ({
  auth  : state.auth
});

const mapDispatchToProps = dispatch => {
  return {
    loginActions: bindActionCreators({ login }, dispatch)
  };
};

export class AuthenticatedView extends React.Component {
  static propTypes = {
    auth          : React.PropTypes.object,
    children      : React.PropTypes.element,
    loginActions  : React.PropTypes.object
  };

  render () {
    const styles = {};

    const { auth, children, loginActions } = this.props;

    if (isAuthenticated(auth)) {
      return (
        <div className='row stretch' style={styles}>
          <div className='col-sm-12 flexCol stretch'>
            {children}
          </div>
        </div>
      );
    } else {
      loginActions.login();
      return (
        <div className='row stretch' style={styles}>
          <p>Loading</p>
        </div>
      );
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthenticatedView);
