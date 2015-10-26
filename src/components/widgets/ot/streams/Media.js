import React from 'react';
import Radium from 'radium';

export const WIDTH = 200;
export const HEIGHT = 150;

@Radium
export default class Media extends React.Component {
  static propTypes = {
    session: React.PropTypes.object,
    stream: React.PropTypes.object
  }

  componentDidMount () {
    const { session, stream } = this.props;
    const options = { width : WIDTH, height: HEIGHT, showControls: false };

    this.subscriber = session.subscribe(stream, this.container, options);
  }

  componentWillUnmount () {
    const { session } = this.props;
    session.unsubscribe(this.subscriber);
  }

  render () {
    const containerStyles = {
      width: WIDTH,
      height: HEIGHT
    };

    return (
      <div style={containerStyles}>
        <div ref={node => this.container = node}/>
      </div>
    );
  }

}
