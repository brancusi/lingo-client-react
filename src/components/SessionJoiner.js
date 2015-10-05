import React from 'react';
import Radium from 'radium';

@Radium
export default class SessionJoiner extends React.Component {
  static propTypes = {
    join: React.PropTypes.func.isRequired
  }

  _clickHandler () {
    this.props.join(this.state.roomName);
  }

  _onChangeHandler () {
    const { roomNameInput } = this.refs;
    this.setState({roomName:roomNameInput.value});
  }

  render () {
    const styles = {
      padding: '5px',
      border: '3px dashed grey'
    };

    return (
      <div className='well' style={styles}>
        <input ref="roomNameInput" onChange={::this._onChangeHandler} />
        <button className='btn btn-default' onClick={::this._clickHandler}>
          Join a Room
        </button>
      </div>
    );
  }
}
