import React from 'react';
import Radium from 'radium';

@Radium
export default class SoundByte extends React.Component {
  static propTypes = {

  }

  componentDidMount () {

  }

  render () {
    const styles = {
      border: '1px solid red',
      position: 'absolute',
      minWidth: 100,
      minHeight: 100,
      zIndex: '1000',
      background: 'white'
    };

    return (
      <div style={styles}>
        Hello!
      </div>
    );
  }
}
