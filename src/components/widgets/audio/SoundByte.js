import React from 'react';
import Radium from 'radium';
import Player from 'components/widgets/audio/SoundBytePlayer';
import fetch from 'isomorphic-fetch';
import { fromJS } from 'immutable';
import guidFn from 'utils/guid';

@Radium
export default class SoundByte extends React.Component {
  static propTypes = {
    id: React.PropTypes.string.isRequired,
    model: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {data: null, guid:null};
  }

  componentDidMount () {
    const { url } = this.props.model;

    fetch(url, {
      method: 'get'
    })
    .then(response => response.blob())
    .then(blob => this.setState({data:blob, guid:guidFn()}));
  }

  shouldComponentUpdate (nextProps, nextState) {
    return this._hasChanged(nextProps, this.props) || (this.state.guid !== nextState.guid);
  }

  _hasChanged (obj, against) {
    return !fromJS(this.props).equals(fromJS(against));
  }

  render () {
    const age = 50;

    const styles = {
      position: 'absolute',
      minWidth: age,
      minHeight: age,
      marginTop: -age / 2,
      marginLeft: -age / 2,
      zIndex: '1000'
    };

    const { data } = this.state;
    const { id } = this.props;

    if ( data ) {
      const playProps = {
        guid: id,
        blob: data
      };

      return (
        <div style={styles}>
          <Player data={playProps} size={age}/>
        </div>
      );
    } else {
      return (
        <div style={styles}>
          Loading
        </div>
      );
    }
  }
}
