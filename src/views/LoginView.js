import React       from 'react';
import { connect } from 'react-redux';
import Footer from 'components/nav/Footer';
import PropTypes from 'react-router';

const mapStateToProps = (state) => ({
  session : state.session
});

export class LoginView extends React.Component {
  static propTypes = {
    dispatch : React.PropTypes.func,
    session  : React.PropTypes.object
  };

  static contextTypes = {
    history: React.PropTypes.func
  };

  render () {
    const styles = {};

    return (
      <div className='flexCol stretch' style={styles} >
        <Footer />
      </div>
    );
  }
}

export default connect(mapStateToProps)(LoginView);
