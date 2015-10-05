import React from 'react';
import 'styles/core.scss';
import Header from 'components/nav/Header';

export default class CoreLayout extends React.Component {
  static propTypes = {
    children : React.PropTypes.element
  }

  constructor () {
    super();
  }

  render () {
    return (
      <div className='fluid-container'>
        <Header />
        {this.props.children}
      </div>
    );
  }
}
