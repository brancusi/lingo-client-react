import React       from 'react';
import OTStreams from 'components/widgets/ot/OTStreams';
import Chat from 'components/widgets/chat/Chat';

export default class CommunicationHud extends React.Component {
  static propTypes = {
    creds : React.PropTypes.object.isRequired,
    chat : React.PropTypes.object.isRequired,
    newChatMessage : React.PropTypes.func.isRequired,
    profileImageUrl : React.PropTypes.string
  };

  render () {
    const { creds, chat, newChatMessage, profileImageUrl } = this.props;

    const countainerStyles = {
      display: 'flex',
      justifyContent: 'space-between',
      zIndex: 1000
    };

    const colContainerStyles = {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end'
    };

    return (
      <div className='row' style={countainerStyles}>
        <div style={colContainerStyles}>
          <OTStreams credentials={creds} profileImageUrl={profileImageUrl}/>
        </div>
        <div style={colContainerStyles}>
          <Chat sessionChat={chat} addChatMessage={newChatMessage} />
        </div>
      </div>
    );
  }
}
