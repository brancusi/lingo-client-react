import React from 'react';
import 'styles/core.scss';

export default class CoreLayout extends React.Component {
  static propTypes = {
    children : React.PropTypes.element
  }

  render () {
    return (
      <div className='container-fluid siteWrapper'>
        {this.props.children}
      </div>
    );
  }
}
