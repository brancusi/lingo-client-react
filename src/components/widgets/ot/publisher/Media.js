import React from 'react';
import Radium from 'radium';

@Radium
export default class Media extends React.Component {
  static propTypes = {
    session: React.PropTypes.object,
  }

  componentDidMount () {
    const { session } = this.props;
    const options = { width : 200, height: 150 };
    const { container } = this.refs;

    this.publisher = session.publish(container, options)
  }

  componentWillUnmount () {
    const { session } = this.props;
    session.unpublish(this.publisher);
  }

  render () {
    return (
      <div>
        <div ref='container'/>
      </div>
    )
  }

}
