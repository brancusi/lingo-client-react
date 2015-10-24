import React from 'react';
import Radium from 'radium';
import Player from 'components/widgets/audio/SoundBytePlayer';
import fetch from 'isomorphic-fetch';

@Radium
export default class SoundByte extends React.Component {
  static propTypes = {
    id: React.PropTypes.string.isRequired,
    model: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {data: null};
  }

  componentDidMount () {
    const { url } = this.props.model;

    fetch(url, {
      method: 'get'
    })
    .then(response => response.blob())
    .then(blob => this.setState({data:blob}));
  }

  render () {
    const { model } = this.props;

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

    const { data } = this.state;
    const { id } = this.props;

    if(data !== undefined && data !== null){
      const playProps = {
        guid: id,
        blob: data
      }

      return (
        <div style={styles}>
          <Player data={playProps} size={30}/>
        </div>
      );
    }else{
      return (
        <div style={styles}>
          Loading
        </div>
      );
    }
  }
}
