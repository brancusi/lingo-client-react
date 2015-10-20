import React from 'react';
import Radium from 'radium';
import Message from 'components/widgets/chat/Message';
import IconButton from 'components/ui/buttons/IconButton';
import { Map } from 'immutable';

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

  componentWillUpdate (prevProps, prevState) {
    const propsChanged = !prevProps.sessionChat.equals(this.props.sessionChat);
    const toggleChanged = prevState.expanded !== this.state.expanded;
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
      TweenMax.to(this.container, 0.4, {height:400, ease:Expo.easeOut, onComplete:(::this._scrollBottom), onUpdate:(::this._scrollBottom)});
    }else{
      TweenMax.to(this.container, 0.3, {height:130, ease:Expo.easeOut, onComplete:(::this._scrollBottom), onUpdate:(::this._scrollBottom)});
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

    const uiStyled = {
      position: 'absolute',
      zIndex: 1,
    }

    const messages = sessionChat
      .map((msg, key) => {
        return (<Message key={key} message={msg} />);
      }).toArray();

    const toggleUiProps = {
      icon: (expanded) ? 'fa-arrow-up' : 'fa-arrow-down',
      size:'24',
      position:{x:370, y:-12},
      borderRadius:'0',
      background:'#595959',
      color:'white',
      border:'0',
      overTween:{top:-12},
      outTween:{top:-10},
      click:(::this.toggle)
    };

    return (
      <div ref={node=>this.container = node} style={styles}>
        <div style={uiStyled}>
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
