import React from 'react';
import Radium from 'radium';
import { fromJS } from 'immutable';
import Media from 'components/widgets/ot/publisher/Media';
import HoverToolbar from 'components/ui/toolbars/HoverToolbar';
import IconButton from 'components/ui/buttons/IconButton';
import ImageLoader from 'components/ui/images/ImageLoader';


@Radium
export default class Manager extends React.Component {
  static propTypes = {
    session: React.PropTypes.object,
    profileImageUrl: React.PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = { publishAudio: true, publishVideo: false };
  }

  _toggleVideo () {
    const { publishVideo } = this.state;
    this.setState({publishVideo:!publishVideo});
  }

  _toggleAudio () {
    const { publishAudio } = this.state;
    this.setState({publishAudio:!publishAudio});
  }

  _createToolbar () {
    const { publishVideo, publishAudio } = this.state;

    const audioToggleProps = {
      icon: publishAudio ? 'fa-microphone' :  'fa-microphone-slash',
      size: 40,
      color: 'white',
      background: 'rgba(0,0,0,0.8)',
      border: '0',
      click: (::this._toggleAudio),

    };

    const videoToggleProps = {
      icon: publishVideo ? 'fa-video-camera' : 'fa-video-camera',
      size: 40,
      color: 'white',
      background: 'rgba(0,0,0,0.8)',
      border: '0',
      click: (::this._toggleVideo)
    };

    const containerStyles = {
      position: 'absolute',
      width: 200,
      height: 150,
      zIndex: 1002
    };

    return (
      <div style={containerStyles}>
        <HoverToolbar options={{background:'rgba(0,189,255,0.7)'}}>
          <IconButton {...videoToggleProps} />
          <IconButton {...audioToggleProps} />
        </HoverToolbar>
      </div>
    );
  }

  _createAvatar () {
    const { publishVideo } = this.state;

    const { profileImageUrl } = this.props;
    const containerStyles = {
      position: 'absolute',
      zIndex: 1001,
      width: 200,
      height: 150,
      overflow: 'hidden'
    };

    if ( publishVideo ) {
      return '';
    } else {
      return (
        <div style={containerStyles}>
          <ImageLoader src={profileImageUrl} />
        </div>
      );
    }

  }

  _createMediaOutlet () {
    const { publishVideo, publishAudio } = this.state;

    const { session, profileImageUrl } = this.props;
    const containerStyles = {
      position: 'absolute',
      zIndex: 1000
    };

    return (
      <div style={containerStyles}>
        <Media session={session} publishVideo={publishVideo} publishAudio={publishAudio} profileImageUrl={profileImageUrl}/>
      </div>
    );
  }

  render () {
    const containerStyles = {
      position: 'relative',
      minWidth: 200,
      minHeight: 150
    };

    return (
      <div style={containerStyles}>
        {this._createMediaOutlet()}
        {this._createAvatar()}
        {this._createToolbar()}
      </div>
    );
  }
}
