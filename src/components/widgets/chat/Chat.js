import React from 'react';
import Radium from 'radium';
import Message from 'components/widgets/chat/Message';
import IconButton from 'components/ui/buttons/IconButton';
import { Map } from 'immutable';

const MINIMIZED_HEIGHT = 130;

@Radium
export default class Chat extends React.Component {
  static propTypes = {
    sessionChat: React.PropTypes.object.isRequired,
    addChatMessage: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {expanded: false, msg:''};
  }

  componentDidMount () {
    this._scrollBottom();
    this._syncToggle();
  }

  componentDidUpdate (nextProps, nextState) {
    const propsChanged = !nextProps.sessionChat.equals(this.props.sessionChat);
    const toggleChanged = nextState.expanded !== this.state.expanded;
    if (toggleChanged) {
      this._syncToggle();
    }

    if (propsChanged) {
      this._scrollBottom();
    }

  }

  toggle () {
    this.setState({expanded:!this.state.expanded});
  }

  _syncToggle () {
    if(this.state.expanded){
      const targetHeight = window.innerHeight/3;
      TweenMax.to(this.container, 0.4, {height:targetHeight, ease:Expo.easeOut, onComplete:(::this._scrollBottom), onUpdate:(::this._scrollBottom)});
    }else{
      TweenMax.to(this.container, 0.3, {height:MINIMIZED_HEIGHT, ease:Expo.easeOut, onComplete:(::this._scrollBottom), onUpdate:(::this._scrollBottom)});
    }
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
    const { expanded, msg } = this.state;

    const styles = {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'white',
      height: 300,
      width: 400,
      boxShadow: '0px 6px 18px -8px rgba(0,0,0,0.75)',
      marginRight: 20
    };

    const historyStyles = {
      backgroundColor: '#FFFFF7',
      padding: '0.5rem 1rem',
      width: '100%',
      overflow: 'auto',
      boxShadow: '0px 6px 24px 0px rgba(158,158,158,0.4)',
      zIndex: 100,
    };

    const inputStyles = {
      border: 'none',
      width: '100%',
      height: '2rem',
      marginTop: '0.5rem',
      marginBottom: '0.5rem',
      padding: '1rem',

      ':focus': {
        outline: 0
      }
    };

    const uiStylesContainer = {
      position: 'absolute',
      left: 370,
      top:-22,
      zIndex: 1
    }

    const messages = sessionChat
      .map((msg, key) => {
        return (<Message key={key} message={msg} />);
      }).toArray();

    const toggleUiProps = {
      icon: (expanded) ? 'fa-arrow-down' : 'fa-arrow-up',
      size:24,
      borderRadius:'0',
      background:'#595959',
      color:'white',
      border:'0',
      overTween:{y:'-=2'},
      outTween:{y:0},
      click:(::this.toggle)
    };

    return (
      <div ref={node=>this.container = node} style={styles}>
        <div style={uiStylesContainer}>
          <IconButton {...toggleUiProps} />
        </div>
        <div ref='historyContainer' className='stretch' style={historyStyles}>
          {messages}
        </div>
        <form onSubmit={::this._onEnter}>
          <input value={msg} ref='chatInput' style={inputStyles} placeholder='Type chat message...' onChange={::this._onPress} />
        </form>
      </div>
    );
  }
}
