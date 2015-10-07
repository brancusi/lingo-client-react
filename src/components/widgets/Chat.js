import React from 'react';
import Radium from 'radium';

@Radium
export default class Chat extends React.Component {
  static propTypes = {
    history: React.PropTypes.object.isRequired
  }

  componentDidMount () {

  }

  _onEnter (e) {
    e.preventDefault();
  }

  render () {
    const styles = {
      backgroundColor: '#F5FCFF',
      borderBottomRightRadius: 8,
      borderTopRightRadius: 8,
      borderRight: '0.0625rem solid #e5e5e5',
      borderBottom: '0.0625rem solid #e5e5e5',
      borderTop: '0.0625rem solid #e5e5e5',
      height: '400px',
      width: '300px',
      position: 'absolute',
      top: '40%',
      marginTop: '-200px',
      padding: '1em',
      flexDirection: 'column'
    };

    const chatTitleStyles = {};

    const historyStyles = {
      border: '0.0625rem solid #e5e5e5',
      backgroundColor: 'white',
      marginBottom: 10
    };

    return (
      <div className='row' style={styles}>
        <p style={chatTitleStyles}>Chat</p>
        <div className='flexStretch' style={historyStyles}>
          <p>hi</p>
        </div>
        <form onSubmit={::this._onEnter}>
          <input ref='chatInput' placeholder='start typing' />
        </form>
      </div>
    );
  }
}
