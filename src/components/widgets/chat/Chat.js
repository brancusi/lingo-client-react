import React from 'react';
import Radium from 'radium';
import Message from 'components/widgets/chat/Message';

@Radium
export default class Chat extends React.Component {
  static propTypes = {
    sessionChat: React.PropTypes.object.isRequired,
    addChatMessage: React.PropTypes.func.isRequired
  }

  componentDidMount () {
    this._scrollBottom();
  }

  componentDidUpdate () {
    this._scrollBottom();
  }

  _scrollBottom () {
    const { historyContainer } = this.refs;
    historyContainer.scrollTop = historyContainer.scrollHeight;
  }

  _onEnter (e) {
    const { chatInput } = this.refs;
    e.preventDefault();
    this.props.addChatMessage(chatInput.value);
    this.setState({msg:''});
  }

  _onPress () {
    const { chatInput } = this.refs;
    this.setState({msg:chatInput.value});
  }

  render () {
    const { sessionChat } = this.props;

    const styles = {
      backgroundColor: 'white',
      borderRight: '0.3rem solid #e5e5e5',
      borderLeft: '0.3rem solid #e5e5e5',
      borderTop: '0.3rem solid #e5e5e5',

      height: 500,
      width: '100%',
      marginTop: -300,
      padding: '1rem',
      flexDirection: 'column'
    };

    const historyStyles = {
      border: '0.0625rem solid #e5e5e5',
      backgroundColor: 'white',
      overflow: 'auto'
    };

    const inputStyles = {
      borderRadius: 8,
      border: '0.4rem solid grey',
      width: '100%',
      height: '4rem',
      padding: '1rem',
      marginTop: '1rem',

      ':focus': {
        outline: 0
      }
    };

    const messages = sessionChat
      .map((msg, key) => {
        return (<Message key={key} message={msg} />);
      }).toArray();

    return (
      <div className='row' style={styles}>
        <div ref='historyContainer' className='stretch' style={historyStyles}>
          {messages}
        </div>
        <form onSubmit={::this._onEnter}>
          <input value={this.state.msg} ref='chatInput' style={inputStyles} placeholder='start typing' onChange={::this._onPress} />
        </form>
      </div>
    );
  }
}
