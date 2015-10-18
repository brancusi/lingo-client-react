import React from 'react';
import Radium from 'radium';

@Radium
export default class SoundByte extends React.Component {
  static propTypes = {

  }

  componentDidMount () {

  }

  render () {

    const age = Math.floor(Math.random() * ((50-100)+1) + 100);

    const styles = {
      border: '1px solid red',
      position: 'absolute',
      minWidth: age,
      minHeight: age,
      marginTop: -age/2,
      marginLeft: -age/2,
      zIndex: '1000',
      background: '#FDF9FF',
      border: '8px solid #DADADA',
      borderRadius: '50%'
    };

    return (
      <div style={styles}>
        
      </div>
    );
  }
}
