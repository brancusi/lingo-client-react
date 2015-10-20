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

  }

  constructor(props) {
    super(props);
    this.state = {recording: false};
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

  _recordingUI () {
    const { recording } = this.state;

    const recordUIContainerStyles = {
      position: 'absolute',
      left: 30,
      top: HEIGHT/2
    }

    const recordingUIProps = {
      size:'40',
      background:'#565656',
      border:'0',
      color:'white',
      icon: (recording) ? 'fa-stop' : 'fa-microphone',
      click:(::this._toggleRecording)
    };

    return (
      <div ref={node=>this.recordUIContainer = node} style={recordUIContainerStyles}>
        <IconButton {...recordingUIProps} />
      </div>
    );
  }

  _okCancelUI () {
    const { recording } = this.state;

    const recordUIContainerStyles = {
      position: 'absolute',
      left: 30,
      top: HEIGHT/2
    }

    const recordingUIProps = {
      size:'40',
      background:'#565656',
      border:'0',
      color:'white',
      icon: (recording) ? 'fa-stop' : 'fa-microphone',
      click:(::this._toggleRecording)
    };

    return (
      <div ref={node=>this.recordUIContainer = node} style={recordUIContainerStyles}>
        <IconButton {...recordingUIProps} />
      </div>
    );
  }

  render () {
    const { stashedRecording } = this.state;

    const styles = {
      border: '1px solid #C4C4C4',
      position: 'relative',
      minWidth: WIDTH,
      minHeight: HEIGHT,
      borderRadius: 12,
      background: '#FFFFF6'
    };

    return (
      <div style={styles}>
        {this._recordingUI()}
        <SoundBytePlayer data={stashedRecording} />
      </div>
    );
  }
}
