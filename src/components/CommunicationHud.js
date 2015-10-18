import React       from 'react';
import OTStreams from 'components/widgets/ot/OTStreams';
import Chat from 'components/widgets/chat/Chat';

export default class CommunicationHud extends React.Component {
  static propTypes = {
    creds : React.PropTypes.object.isRequired,
    chat : React.PropTypes.object.isRequired,
    newChatMessage : React.PropTypes.func.isRequired
  };

  render () {
    const { creds, chat, newChatMessage } = this.props;

    const styles = {
      position: 'absolute',
      left: 0,
      bottom: 0,
      display: 'flex',
      width: '100%',
      zIndex: 1000
    };

    const otContainerStyles = {

    }

    const chatContainerStyles = {

    };

    const spacerStyles = {
      flex: 1
    }

    const outerWrapperStyles = {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-end'
    }

    return (
      <div style={styles}>
        <div style={outerWrapperStyles}>
          <div style={otContainerStyles}>
            <OTStreams credentials={creds} />
          </div>
        </div>
        <div style={spacerStyles}></div>
        <div style={outerWrapperStyles}>
          <div style={chatContainerStyles}>
            <Chat sessionChat={chat} addChatMessage={newChatMessage} />
          </div>
      </div>
      </div>
    );
  }
}
