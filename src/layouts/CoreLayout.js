import React from 'react';
import 'styles/core.scss';
import Header from 'components/nav/Header';

export default class CoreLayout extends React.Component {
  static propTypes = {
    children : React.PropTypes.element
  }

  componentWillMount () {
    this.lock = new Auth0Lock('IXz44ZCMA14vR3WOb48SH9JS14eQd9Wx', 'lingo.auth0.com');
  }

  render () {
    const styles = {
      backgroundColor: '#F9F9F9'
    };

    return (
      <div className='container-fluid siteWrapper' style={styles}>
        <Header lock={this.lock} />
        {this.props.children}
      </div>
    );
  }
}
