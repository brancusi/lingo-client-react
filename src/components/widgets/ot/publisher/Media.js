import React from 'react';
import Radium from 'radium';
import { fromJS } from 'immutable';

export const WIDTH = 200;
export const HEIGHT = 150;

@Radium
export default class Media extends React.Component {
  static propTypes = {
    session: React.PropTypes.object,
    publishVideo: React.PropTypes.bool.isRequired,
    publishAudio: React.PropTypes.bool.isRequired,
    profileImageUrl: React.PropTypes.string
  }

  componentDidMount () {
    this._createPublisher();
    this._syncVideoState();
    this._syncAudioState();
  }

  componentWillUnmount () {
    const { session } = this.props;
    session.unpublish(this.publisher);
  }

  shouldComponentUpdate ( nextProps, nextState ) {
    // const sessionChanged = _hasChanged(nextProps.session, this.props.session);
    const videoStateChanged = nextProps.publishVideo !== this.props.publishVideo;
    const audioStateChanged = nextProps.publishAudio !== this.props.publishAudio;

    return videoStateChanged || audioStateChanged;
  }

  componentDidUpdate (prevProps, prevState) {
    // const sessionChanged = _hasChanged(nextProps.session, this.props.session);
    const videoStateChanged = prevProps.publishVideo !== this.props.publishVideo;
    const audioStateChanged = prevProps.publishAudio !== this.props.publishAudio;

    // if(sessionChanged)this._createPublisher();
    if(videoStateChanged)this._syncVideoState();
    if(audioStateChanged)this._syncAudioState();
  }

  _createPublisher () {
    const { session, profileImageUrl } = this.props;
    const options = {
      width : WIDTH,
      height: HEIGHT,
      showControls: false,
      publishVideo: false,
      publishAudio: false
     };
    this.publisher = session.publish(this.container, options);
  }

  _hasChanged (obj, against) {
    return !fromJS(this.props).equals(fromJS(against));
  }

  _syncAudioState () {
    const { publishAudio } = this.props;

    if(publishAudio) {
      this.publisher.publishAudio(true);
    }else{
      this.publisher.publishAudio(false);
    }
  }

  _syncVideoState () {
    const { publishVideo } = this.props;

    if(publishVideo) {
      this.publisher.publishVideo(true);
    }else{
      this.publisher.publishVideo(false);
    }
  }

  render () {
    const containerStyles = {
      width: WIDTH,
      height: HEIGHT
    };

    return (
      <div style={containerStyles}>
        <div ref={node => this.container = node}/>
      </div>
    );
  }

}
