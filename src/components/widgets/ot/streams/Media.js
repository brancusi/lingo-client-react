import React from 'react';
import Radium from 'radium';

@Radium
export default class Media extends React.Component {
  static propTypes = {
    session: React.PropTypes.object,
    stream: React.PropTypes.object
  }

  componentDidMount () {
    const { session, stream } = this.props;
    const options = { width : 200, height: 150 };
    const { container } = this.refs;

    this.subscriber = session.subscribe(stream, container, options);
  }

  componentWillUnmount () {
    const { session } = this.props;
    session.unsubscribe(this.subscriber);
  }

  render () {
    return (
      <div>
        <div ref='container'/>
      </div>
    );
  }

}
