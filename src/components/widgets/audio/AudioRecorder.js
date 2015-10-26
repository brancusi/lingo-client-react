import OggRecorder from 'utils/AudioRecorder';

import React from 'react';
import Radium from 'radium';
import IconButton from 'components/ui/buttons/IconButton';
import SoundBytePlayer from 'components/widgets/audio/SoundBytePlayer';
import guid from 'utils/guid';

const WIDTH = 300;
const HEIGHT = 85;

@Radium
export default class AudioRecorder extends React.Component {
  static propTypes = {
    save: React.PropTypes.func.isRequired,
    cancel: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = { recording: false, stashedRecording: undefined };
  }

  componentDidMount () {
    this._createRecoder();
  }

  _createRecoder () {
    this.recorder = OggRecorder.getInstance();

    this.recorder.recordings
      .subscribe(recording => this._stashRecording(recording));
  }

  _stashRecording ( recording ) {
    this.setState({stashedRecording: {guid:guid(), blob:recording}});
  }

  _toggleRecording () {
    if ( this.state.recording ) {
      this._stopRecording();
    } else {
      this._startRecording();
    }

    this.setState({recording:!this.state.recording});
  }

  _startRecording () {
    this.recorder.record();
  }

  _stopRecording () {
    this.recorder.stop();
  }

  _okClickedHandler () {
    const { save } = this.props;
    const { stashedRecording } = this.state;
    save(stashedRecording);
  }

  _audioUI () {
    const { recording, stashedRecording } = this.state;

    const SIZE = 40;
    const recordUIContainerStyles = {
      position: 'absolute',
      width: WIDTH,
      height: HEIGHT,
      padding: '0 20px',
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'space-between'
    }

    const recordingUIProps = {
      size:SIZE,
      background:'#565656',
      border:'0',
      color:'white',
      icon: (recording) ? 'fa-stop' : 'fa-microphone',
      click:(::this._toggleRecording)
    };

    return (
      <div ref={node=>this.recordUIContainer = node} style={recordUIContainerStyles}>
        <IconButton {...recordingUIProps} />
        <SoundBytePlayer data={stashedRecording} size={SIZE} />
      </div>
    );
  }

  _okCancelUI () {
    const { recording, stashedRecording } = this.state;
    const { cancel } = this.props;

    const hasRecording = stashedRecording !== undefined;
    const disabled = recording || !hasRecording;

    const styles = {
      position: 'absolute',
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      top: HEIGHT-14,
      left: 26,
      width: '100%'
    }

    const iconContainerStyles = {
      paddingLeft: 7
    }

    const okProps = {
      size:40,
      icon: 'fa-check',
      color: '#3176FF',
      click:(::this._okClickedHandler),
      disabled: disabled
    };

    const cancelProps = {
      size:20,
      icon: 'fa-times',
      color: '#FF8080',
      click:cancel
    };

    return (
      <div ref={node=>this.okCancelContainer = node} style={styles}>
        <div style={iconContainerStyles}>
          <IconButton {...cancelProps} />
        </div>
        <div style={iconContainerStyles}>
          <IconButton {...okProps} />
        </div>
      </div>
    );
  }

  render () {
    const styles = {
      border: '4px solid #C4C4C4',
      position: 'relative',
      minWidth: WIDTH,
      minHeight: HEIGHT,
      borderRadius: 12,
      background: '#FFFFF6'
    };

    return (
      <div style={styles}>
        {this._audioUI()}
        {this._okCancelUI()}
      </div>
    );
  }
}
