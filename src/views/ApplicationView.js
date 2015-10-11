import React       from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { login, logout } from 'actions/auth';
import Header from 'components/nav/Header';

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = dispatch => {
  return {
    loginActions: bindActionCreators({ login, logout }, dispatch)
  }
}

export class ApplicationView extends React.Component {
  static propTypes = {
    children : React.PropTypes.element,
    auth : React.PropTypes.object,
    loginActions : React.PropTypes.object.isRequired
  };

  render () {
    const styles = {
      backgroundColor: '#F9F9F9'
    };

    const { children, loginActions, auth } = this.props;

    return (
      <div className='row stretch' style={styles}>
        <div className='col-sm-12 flexCol stretch'>
          <Header login={loginActions.login} logout={loginActions.logout} auth={auth}/>
          <div className='flexCol stretch'>
              {children}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationView);
